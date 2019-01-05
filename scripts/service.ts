import * as client from '@sendgrid/client';
import { getApiKey } from './config';
import * as fs from 'fs';

const apiKey = getApiKey();
client.setApiKey(apiKey);

export interface Version {
  id: string;
  user_id: number;
  template_id: string;
  active: number;
  name: string;
  html_content: string;
  plain_content: string;
  editor: string;
  subject: string;
  updated_at: string;
}
export interface Template {
  id: string;
  name: string;
  versions: Version[];
}

export const getAllLegacyTemplateAsync = async () => {
  const request = {
    method: 'GET',
    url: `/v3/templates?generations=legacy`
  };
  try {
    const [response] = await client.request(request);
    return response.body.templates as Template[];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTemplateAsync = async (templateId: string) => {
  const request = {
    method: 'GET',
    url: `/v3/templates/${templateId}`
  };
  try {
    const [response] = await client.request(request);
    return response.body as Template;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createTemplateAsync = async (template: Partial<Template>) => {
  const request = {
    method: 'POST',
    url: `/v3/templates`,
    body: template
  };
  try {
    const [response] = await client.request(request);
    return response.body as Template;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTemplateAsync = async (templateId: string) => {
  const request = {
    method: 'DELETE',
    url: `/v3/templates/${templateId}`
  };
  try {
    const [response] = await client.request(request);
    return response.statusCode === 204;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createTemplateVersionAsync = async (
  templateId: string,
  version: Partial<Version>
) => {
  const request = {
    method: 'POST',
    url: `/v3/templates/${templateId}/versions`,
    body: version
  };
  try {
    const [response] = await client.request(request);
    return response.body as Version;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateTemplateVersionAsync = async (
  templateId: string,
  versionId: string,
  version: Partial<Version>
) => {
  const request = {
    method: 'PATCH',
    url: `/v3/templates/${templateId}/versions/${versionId}`,
    body: version
  };
  try {
    const [response] = await client.request(request);
    return response.body as Version;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTemplateVersionAsync = async (
  templateId: string,
  versionId: string
) => {
  const request = {
    method: 'DELETE',
    url: `/v3/templates/${templateId}/versions/${versionId}`
  };
  try {
    const [response] = await client.request(request);
    return response.statusCode === 204;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getContent = (path: string) => {
  try {
    const data = fs.readFileSync(path);
    return data.toString();
  } catch (error) {
    console.error(error);
    return null;
  }
};
