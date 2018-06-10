/*
 * Copyright (C) 2018 RedHat and others.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
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