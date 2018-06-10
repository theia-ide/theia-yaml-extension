/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from "inversify";
import { BaseLanguageClientContribution, Workspace, Languages, LanguageClientFactory, ILanguageClient } from '@theia/languages/lib/browser';
import { YAML_LANGUAGE_ID, YAML_LANGUAGE_NAME } from '../common';
import { YAMLPreferences } from "./yaml-preferences";

@injectable()
export class YAMLClientContribution extends BaseLanguageClientContribution {

    readonly id = YAML_LANGUAGE_ID;
    readonly name = YAML_LANGUAGE_NAME;

    constructor(
        @inject(Workspace) protected readonly workspace: Workspace,
        @inject(Languages) protected readonly languages: Languages,
        @inject(LanguageClientFactory) protected readonly languageClientFactory: LanguageClientFactory,
        @inject(YAMLPreferences) protected readonly yamlPreferences: YAMLPreferences
    ) {
        super(workspace, languages, languageClientFactory);
    }

    protected get globPatterns() {
        return [
            '**/*.yaml',
            '**/*.yml'
        ];
    }

    protected onReady(languageClient: ILanguageClient): void {
        super.onReady(languageClient);
    }

}