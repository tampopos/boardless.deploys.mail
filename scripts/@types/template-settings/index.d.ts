declare module '*/template-settings.json' {
  interface TemplateSetting {
    name: string;
    versionName: string;
    subject: string;
    path: string;
  }

  const value: {
    templateSettings: TemplateSetting[];
  };
  export = value;
}
