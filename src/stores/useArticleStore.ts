import {create} from 'zustand';

interface ArticleStore{
    selectedIds: Set<string>;
    selectionMode: boolean;

    isMobileMenuOpen: boolean;

    sortBy: 'createdAt' | 'title' | 'updatedAt';
    sortOrder: 'asc'|'desc';

    searchQuery: string;
    isSearched: boolean;

    toggleSelect: (id:string) => void;
    selectAll: (ids:string[]) => void;
    clearSelection: () => void;
    setMobileMenuOpen : (open:boolean) => void;
    setSortBy: (sortBy: 'createdAt' | 'title' | 'updatedAt' ) => void;
    toggleSortOrder: () =>  void;
    setSearchQuery: (query:string) => void;
    setIsSearched: (searched: boolean) => void;
    clearSearch: () => void;
}

export const useArticleStore = create<ArticleStore>((set,get) => ({
    selectedIds: new Set(),
    selectionMode: false,
    isMobileMenuOpen: false,
    sortBy:'createdAt',
    sortOrder:'desc',
    searchQuery: '',
    isSearched:false,

    toggleSelect: (id) => set((state) => {
        const newSet = new Set(state.selectedIds);
        if(newSet.has(id)){
            newSet.delete(id);
        }else{
            newSet.add(id);
        }
        return{
            selectedIds: newSet,
            selectionMode: newSet.size > 0
        };
    }),

    selectAll: (ids) => set((state) => {
        if(state.selectedIds.size === ids.length) {
            return { selectedIds: new Set(), selectionMode:false}
        }return {selectedIds:new Set(ids), selectionMode:true}
    }),

    clearSelection: () => set({selectedIds: new Set(), selectionMode:false}),

    setMobileMenuOpen: (open) => set({isMobileMenuOpen:open}),

    setSortBy: (sortBy) => set((state) => ({
        sortBy,
        sortOrder: state.sortBy === sortBy ?
        (state.sortOrder === 'desc' ? 'asc' : 'desc') : 'desc'
    })),

    toggleSortOrder: () => set((state) => ({
        sortOrder: state.sortOrder === 'desc' ? 'asc' : 'desc'
    })),

    setSearchQuery: (query) => set({searchQuery: query}),

    setIsSearched: (searched) => set({isSearched: searched}),

    clearSearch: () => set({searchQuery: '' , isSearched:false}),
}))