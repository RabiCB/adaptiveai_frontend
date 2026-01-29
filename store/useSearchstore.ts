import { create } from 'zustand'

interface SearchState {



    searchquery: string


    setSearch: (search: string) => void


    clearSearch: () => void
}

export const useSearchStore= create<SearchState>()(

    (set) => ({

        searchquery: " ",
        setSearch: (searchquery: string) => set({ searchquery }),
        clearSearch: () => set({ searchquery: " " }),

    })

)