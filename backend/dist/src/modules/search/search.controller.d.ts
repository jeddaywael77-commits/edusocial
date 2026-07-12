import { SearchService } from './search.service';
import { GlobalSearchDto, AutocompleteDto } from './dto/search.dto';
import { SearchProcessor } from './processors/search.processor';
export declare class SearchController {
    private readonly searchService;
    private readonly searchProcessor;
    constructor(searchService: SearchService, searchProcessor: SearchProcessor);
    globalSearch(query: GlobalSearchDto): Promise<Record<string, any>>;
    autocomplete(query: AutocompleteDto): Promise<any[]>;
    getStats(): Promise<Record<string, any>>;
    reindex(entityType: string): Promise<{
        message: string;
    }>;
    initialize(): Promise<{
        message: string;
    }>;
}
