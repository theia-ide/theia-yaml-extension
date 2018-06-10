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

import { interfaces } from 'inversify';
import { createPreferenceProxy, PreferenceProxy, PreferenceService, PreferenceContribution, PreferenceSchema } from '@theia/core/lib/browser';

export const YAMLConfigSchema: PreferenceSchema = {
    'type': 'object',
    "properties": {
        "yaml.schemas": {
          "type": "object",
          "default": {},
          "description": "Associate schemas to YAML files in the current workspace"
        },
        "yaml.format.enable": {
          "type": "boolean",
          "default": false,
          "description": "Enable/disable default YAML formatter (requires restart)"
        },
        "yaml.validate": {
          "type": "boolean",
          "default": true,
          "description": "Enable/disable validation feature"
        },
        "yaml.customTags": {
          "type": "array",
          "default": [],
          "description": "Custom tags for the parser to use"
        }
      }
};

export interface YAMLConfiguration {
    'yaml.schemas': Object,
    'yaml.format.enable': boolean,
    'yaml.validate': boolean,
    'yaml.customTags': Array<String>
}

export const YAMLPreferences = Symbol('YAMLPreferences');
export type YAMLPreferences = PreferenceProxy<YAMLConfiguration>;

export function createYAMLPreferences(preferences: PreferenceService): YAMLPreferences {
    return createPreferenceProxy(preferences, YAMLConfigSchema);
}

export function bindYAMLPreferences(bind: interfaces.Bind): void {
    bind(YAMLPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get<PreferenceService>(PreferenceService);
        return createYAMLPreferences(preferences);
    });
    bind(PreferenceContribution).toConstantValue({ schema: YAMLConfigSchema });
}