import {
  Template,
  createTemplateAsync,
  createTemplateVersionAsync,
  getContent,
  updateTemplateVersionAsync,
  deleteTemplateAsync,
  deleteTemplateVersionAsync
} from './service';
import { templateSettings } from './template-settings.json';

type TemplateSetting = typeof templateSettings[0];
export const getTemplateDifference = (currentTemplates: Template[]) => {
  const creatingTemplates: TemplateSetting[] = [];
  const updatingTemplates: {
    current: Template;
    setting: TemplateSetting;
  }[] = [];
  const deletingTemplates: Template[] = [];
  templateSettings.forEach(setting => {
    const current = currentTemplates.filter(c => c.name === setting.name)[0];
    if (current) {
      updatingTemplates.push({ current, setting });
      return;
    }
    creatingTemplates.push(setting);
  });
  currentTemplates.forEach(current => {
    const setting = templateSettings.filter(s => current.name === s.name)[0];
    if (setting) {
      return;
    }
    deletingTemplates.push(current);
  });
  return { creatingTemplates, updatingTemplates, deletingTemplates };
};

export const createAsync = async (creatingTemplates: TemplateSetting[]) => {
  await Promise.all(
    creatingTemplates.map(async creatingTemplate => {
      console.info(`テンプレート(${creatingTemplate.name})を作成します。`);
      const content = getContent(creatingTemplate.path);
      if (!content) {
        throw new Error('コンテントの読込に失敗しました。');
      }
      const template = await createTemplateAsync({
        name: creatingTemplate.name
      });
      if (!template) {
        throw new Error('テンプレートの作成に失敗しました。');
      }
      const version = await createTemplateVersionAsync(template.id, {
        name: creatingTemplate.versionName,
        subject: creatingTemplate.subject,
        html_content: content,
        plain_content: content
      });
      if (!version) {
        throw new Error('テンプレートバージョンの作成に失敗しました。');
      }
    })
  );
};
export const updateAsync = async (
  updatingTemplates: {
    current: Template;
    setting: TemplateSetting;
  }[]
) => {
  await Promise.all(
    updatingTemplates.map(async ({ current, setting }) => {
      console.info(`テンプレート(${setting.name})を更新します。`);
      const content = getContent(setting.path);
      if (!content) {
        throw new Error('コンテントの読込に失敗しました。');
      }
      const currentVersion = current.versions[0];
      if (!currentVersion) {
        const version = await createTemplateVersionAsync(current.id, {
          name: setting.versionName,
          subject: setting.subject,
          html_content: content,
          plain_content: content
        });
        if (!version) {
          throw new Error('テンプレートバージョンの作成に失敗しました。');
        }
        return;
      }
      const version = await updateTemplateVersionAsync(
        current.id,
        currentVersion.id,
        {
          name: setting.versionName,
          subject: setting.subject,
          html_content: content,
          plain_content: content
        }
      );
      if (!version) {
        throw new Error('テンプレートバージョンの作成に失敗しました。');
      }
    })
  );
};
export const deleteAsync = async (deletingTemplates: Template[]) => {
  await Promise.all(
    deletingTemplates.map(async deletingTemplate => {
      console.info(`テンプレート(${deletingTemplate.name})を削除します。`);
      for (const version of deletingTemplate.versions) {
        const ret = await deleteTemplateVersionAsync(
          deletingTemplate.id,
          version.id
        );
        if (!ret) {
          throw new Error('テンプレートバージョンの削除に失敗しました。');
        }
      }
      const ret = await deleteTemplateAsync(deletingTemplate.id);
      if (!ret) {
        throw new Error('テンプレートの削除に失敗しました。');
      }
    })
  );
};
