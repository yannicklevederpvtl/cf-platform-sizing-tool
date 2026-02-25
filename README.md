# CF Platform Sizing Tool (Chrome Extension)

Chrome extension for Cloud Foundry platform sizing.

## Getting started

1. Clone this repository:
   ```bash
   git clone <repo-url>
   ```
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the `cf-platform-sizing-tool` folder from the cloned repo. The extension will load from the built files here.

## Privacy and network

Everything runs locally in your browser. The only network egress is:

- **Azure** – If you use Azure pricing, the extension can call Azure's retail prices API for the selected region.
- **OpenAPI / LLM** – If you configure and use the chat or AI features, requests go to the configured API endpoint (e.g. OpenAI-compatible). When using the extension without a backend, you can use any HTTPS OpenAI-compatible endpoint; the extension will request access only to the host you configure (e.g. api.openai.com or your company API).

If you don't use those features or don't configure an API base or LLM provider, no external endpoints are called.

## Instance types and pricing data

Pricing and instance-type data are seeded only for certain regions:

- **Azure:** East US (`eastus`) is seeded; other regions can be synced within the tool (via Settings → Pricing and the Azure pricing API).
- **AWS:** Six regions are seeded: **us-east-1**, **us-east-2**, **us-west-1**, **us-west-2**, **ca-central-1**, **ca-west-1**.
- **GCP** and other regions are planned for a future release.

## Disclaimer

The sizing and cost figures from this tool are estimates only. Work with your Broadcom contact for official numbers and refer to the latest product documentation.
