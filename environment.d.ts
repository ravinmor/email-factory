declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      EMAILPROTONMAIL: string;
      PASSWORDPROTONMAIL: string;
    }
  }
}

export {}