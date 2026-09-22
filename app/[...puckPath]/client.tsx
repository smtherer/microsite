"use client";

import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import { withDynamicConfig } from "@puckeditor/plugin-ai";
// 1. If you used "export const config", use: import { config } from "../../puck.config";
// 2. If you used "export default config", keep: import config from "../../puck.config";
import config from "../../puck.config";

export function Client({ data }: { data: Data }) {
  // Cast 'config as any' to bypass the plugin-ai vs core type collision
  const configWithDesignedComponents = withDynamicConfig(config as any, data as any);

  return (
    <Render 
      config={configWithDesignedComponents as any} 
      data={data} 
    />
  );
}
