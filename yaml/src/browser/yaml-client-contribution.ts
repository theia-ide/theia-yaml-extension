/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 *   TypeFox (typefox.io)
 */

import { injectable, inject } from "inversify";
import { BaseLanguageClientContribution, Workspace, Languages, LanguageClientFactory, ILanguageClient } from '@theia/languages/lib/browser';
import { YAML_LANGUAGE_ID, YAML_LANGUAGE_NAME } from '../common';
import { YAMLPreferences } from "./yaml-preferences";
import { JsonSchemaStore } from '@theia/core/lib/browser/json-schema-store';
import { ResourceProvider } from "@theia/core";
import URI from "@theia/core/lib/common/uri";

@injectable()
export class YAMLClientContribution extends BaseLanguageClientContribution {

    readonly id = YAML_LANGUAGE_ID;
    readonly name = YAML_LANGUAGE_NAME;

    constructor(
        @inject(Workspace) protected readonly workspace: Workspace,
        @inject(ResourceProvider) protected readonly resourceProvider: ResourceProvider,
        @inject(Languages) protected readonly languages: Languages,
        @inject(LanguageClientFactory) protected readonly languageClientFactory: LanguageClientFactory,
        @inject(YAMLPreferences) protected readonly preferences: YAMLPreferences,
        @inject(JsonSchemaStore) protected readonly jsonSchemaStore: JsonSchemaStore
    ) {
        super(workspace, languages, languageClientFactory);
        preferences.onPreferenceChanged(e => {
            if (e.preferenceName === 'yaml.schemas') {
                this.updateSchemas();
            }
        });
        jsonSchemaStore.onSchemasChanged(() => {
            this.updateSchemas();
        });
        this.updateSchemas();
    }

    protected async updateSchemas(): Promise<void> {
        const allConfigs = [...this.jsonSchemaStore.getJsonSchemaConfigurations()];
        const config = this.preferences['yaml.schemas'];
        if (config instanceof Array) {
            allConfigs.push(...config);
        }
        const registry: { [pattern: string]: string[] } = {};
        for (const s of allConfigs) {
            if (s.fileMatch) {
                for (const p of s.fileMatch) {
                    registry[p] = [s.url];
                }
            }
        }
        const client = await this.languageClient;
        client.sendNotification('json/schemaAssociations', registry);
    }

    protected get globPatterns() {
        return [
            '**/*.yaml',
            '**/*.yml',
            '**/*.eyaml',
            '**/*.eyml'
        ];
    }

    protected onReady(languageClient: ILanguageClient): void {
        // handle content request
        languageClient.onRequest('vscode/content', async (uriPath: string) => {
            const uri = new URI(uriPath);
            const resource = await this.resourceProvider(uri);
            const text = await resource.readContents();
            return text;
        });
        super.onReady(languageClient);
    }

}