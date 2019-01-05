import { getAllLegacyTemplateAsync } from './service';
import {
  getTemplateDifference,
  createAsync,
  updateAsync,
  deleteAsync
} from './use-case.js';

const execute = async () => {
  const currentTemplates = await getAllLegacyTemplateAsync();
  if (!currentTemplates) {
    throw new Error('現在のテンプレートが取得できませんでした。');
  }
  const {
    creatingTemplates,
    updatingTemplates,
    deletingTemplates
  } = getTemplateDifference(currentTemplates);
  await deleteAsync(deletingTemplates);
  await createAsync(creatingTemplates);
  await updateAsync(updatingTemplates);
};
execute();
