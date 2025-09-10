import {create} from 'zustand';


// const useThemeStore = create((set) => ({
//     theme:"coffee",
//     setTheme: (newTheme) => {       
     
//         set({ theme: newTheme });
//     }   
// }));

// export default useThemeStore;

const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'coffee',
    setTheme: (newTheme) => {   
        localStorage.setItem('theme', newTheme);     
        set({ theme: newTheme });
    }   
}));

export default useThemeStore;