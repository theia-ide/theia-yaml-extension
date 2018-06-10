/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
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