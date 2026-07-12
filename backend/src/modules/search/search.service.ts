import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Meilisearch } from 'meilisearch';
import { SEARCH_INDEXES, SearchIndexName } from './indexes/search-indexes';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: Meilisearch;
  private readonly indexPrefix: string;

  constructor(private readonly config: ConfigService) {
    this.indexPrefix =
      this.config.get<string>('search.indexPrefix') || 'edusocial_';
  }

  onModuleInit() {
    const host =
      this.config.get<string>('search.host') || 'http://127.0.0.1:7700';
    const apiKey = this.config.get<string>('search.apiKey') || '';

    this.client = new Meilisearch({ host, apiKey });
    this.logger.log(`Meilisearch client initialized: ${host}`);
  }

  getClient(): Meilisearch {
    return this.client;
  }

  getIndexName(entityType: SearchIndexName): string {
    return `${this.indexPrefix}${entityType}`;
  }

  getIndex(entityType: SearchIndexName) {
    return this.client.index(this.getIndexName(entityType));
  }

  async initializeIndexes(): Promise<void> {
    for (const [key, config] of Object.entries(SEARCH_INDEXES)) {
      const indexName = this.getIndexName(key as SearchIndexName);
      try {
        await this.client.createIndex(indexName, {
          primaryKey: config.primaryKey,
        });
        const index = this.client.index(indexName);

        await index.updateSearchableAttributes([
          ...config.searchableAttributes,
        ]);
        await index.updateFilterableAttributes([
          ...config.filterableAttributes,
        ]);
        await index.updateSortableAttributes([...config.sortableAttributes]);
        await index.updateRankingRules([...config.rankingRules]);

        this.logger.log(`Initialized index: ${indexName}`);
      } catch (error: any) {
        if (error?.code === 'index_already_exists') {
          this.logger.debug(`Index already exists: ${indexName}`);
        } else {
          this.logger.error(`Failed to initialize index ${indexName}:`, error);
        }
      }
    }
  }

  async search(
    query: string,
    options: {
      indexes?: string[];
      limit?: number;
      offset?: number;
      filters?: Record<string, string | number | boolean>;
    } = {},
  ): Promise<Record<string, any>> {
    const { indexes, limit = 20, offset = 0, filters } = options;
    const targetIndexes =
      indexes?.filter((i): i is SearchIndexName => i in SEARCH_INDEXES) ||
      (Object.keys(SEARCH_INDEXES) as SearchIndexName[]);

    const results: Record<string, any> = {};

    const searchPromises = targetIndexes.map(async (indexName) => {
      try {
        const index = this.getIndex(indexName);
        const filterArray = filters
          ? Object.entries(filters).map(
              ([k, v]) => `${k} = ${typeof v === 'string' ? `"${v}"` : v}`,
            )
          : undefined;

        const searchResult = await index.search(query, {
          limit,
          offset,
          filter: filterArray,
          attributesToHighlight: ['*'],
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
        });

        results[indexName] = {
          hits: searchResult.hits,
          totalHits:
            searchResult.estimatedTotalHits || searchResult.hits.length,
          processingTimeMs: searchResult.processingTimeMs,
        };
      } catch (error) {
        this.logger.warn(`Search failed for index ${indexName}:`, error);
        results[indexName] = { hits: [], totalHits: 0, processingTimeMs: 0 };
      }
    });

    await Promise.all(searchPromises);
    return results;
  }

  async autocomplete(
    query: string,
    options: {
      index?: string;
      limit?: number;
    } = {},
  ): Promise<any[]> {
    const { index: indexName = 'users', limit = 5 } = options;
    const validIndex =
      indexName in SEARCH_INDEXES ? (indexName as SearchIndexName) : 'users';

    try {
      const index = this.getIndex(validIndex);
      const searchResult = await index.search(query, {
        limit,
        attributesToHighlight: ['*'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      });

      return searchResult.hits;
    } catch (error) {
      this.logger.warn(`Autocomplete failed for index ${validIndex}:`, error);
      return [];
    }
  }

  async addDocuments(
    entityType: SearchIndexName,
    documents: any[],
  ): Promise<void> {
    if (!documents.length) return;

    try {
      const index = this.getIndex(entityType);
      await index.addDocuments(documents);
      this.logger.debug(`Added ${documents.length} documents to ${entityType}`);
    } catch (error) {
      this.logger.error(`Failed to add documents to ${entityType}:`, error);
    }
  }

  async updateDocuments(
    entityType: SearchIndexName,
    documents: any[],
  ): Promise<void> {
    if (!documents.length) return;

    try {
      const index = this.getIndex(entityType);
      await index.updateDocuments(documents);
      this.logger.debug(
        `Updated ${documents.length} documents in ${entityType}`,
      );
    } catch (error) {
      this.logger.error(`Failed to update documents in ${entityType}:`, error);
    }
  }

  async deleteDocument(
    entityType: SearchIndexName,
    documentId: string,
  ): Promise<void> {
    try {
      const index = this.getIndex(entityType);
      await index.deleteDocument(documentId);
      this.logger.debug(`Deleted document ${documentId} from ${entityType}`);
    } catch (error) {
      this.logger.error(`Failed to delete document from ${entityType}:`, error);
    }
  }

  async deleteDocuments(
    entityType: SearchIndexName,
    documentIds: string[],
  ): Promise<void> {
    if (!documentIds.length) return;

    try {
      const index = this.getIndex(entityType);
      await index.deleteDocuments(documentIds);
      this.logger.debug(
        `Deleted ${documentIds.length} documents from ${entityType}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete documents from ${entityType}:`,
        error,
      );
    }
  }

  async clearIndex(entityType: SearchIndexName): Promise<void> {
    try {
      const index = this.getIndex(entityType);
      await index.deleteAllDocuments();
      this.logger.log(`Cleared index: ${entityType}`);
    } catch (error) {
      this.logger.error(`Failed to clear index ${entityType}:`, error);
    }
  }

  async getIndexStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};

    for (const key of Object.keys(SEARCH_INDEXES) as SearchIndexName[]) {
      try {
        const index = this.getIndex(key);
        const indexStats = await index.getStats();
        stats[key] = {
          numberOfDocuments: indexStats.numberOfDocuments,
          isIndexing: indexStats.isIndexing,
        };
      } catch (error) {
        stats[key] = { numberOfDocuments: 0, isIndexing: false };
      }
    }

    return stats;
  }
}
