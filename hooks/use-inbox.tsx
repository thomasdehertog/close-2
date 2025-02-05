import { create } from 'zustand';

interface InboxStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useInbox = create<InboxStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
})); 