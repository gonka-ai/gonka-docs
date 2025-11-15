/**
 * Quickstart Questionnaire Flow (Block Scheme)
 *
 * [Start]
 *   ↓
 * [Q1] Protocol? (HTTP / HTTPS)
 *   ├─ HTTP selected:
 *   │     - Set protocolHttp
 *   │     - Use NGINX_MODE=http and API_PORT=8000
 *   │     - → [Generate config.env]
 *   └─ HTTPS selected:
 *         ↓
 *      [Q2] Domain configured? (Yes / No)
 *         ├─ No:
 *         │     - Set domainNo + protocolHttp (fallback to HTTP)
 *         │     - Show HTTP-only note (no HTTPS without domain)
 *         │     - → [Generate config.env]
 *         └─ Yes:
 *              ↓
 *           [Q3] SSL certificate method? (Auto / Manual)
 *              ├─ Manual:
 *              │     - Set certMethodManual
 *              │     - Require SERVER_NAME + SSL_CERT_SOURCE
 *              │     - → [Generate config.env]
 *              └─ Auto:
 *                   ↓
 *                [Q4] DNS provider? (Cloudflare / Route53 / GCloud / Azure / DigitalOcean / Hetzner)
 *                   - Set certMethodAuto
 *                   - Set provider key (ACME_DNS_PROVIDER)
 *                   - Require CERT_ISSUER_DOMAIN + CERT_ISSUER_JWT_SECRET
 *                   - → [Generate config.env]
 *
 * State is persisted in localStorage (7 days) and drives:
 *   - Dynamic config.env preview
 *   - Edit table with human-readable instructions for each variable
 */
/**
 * Quickstart Configuration Questionnaire Widget
 * Dynamically generates config.env based on user choices
 */

(function() {
  'use strict';

  // Debug: Log that script is loading
  console.log('Quickstart configurator script loaded');

  // Multilingual question texts
  const translations = {
    en: {
      title: "SSL Configuration",
      subtitle: "Configure your SSL/TLS settings for secure HTTPS connections",
      protocolQuestion: "Do you want to serve your API through:",
      protocolHttp: "HTTP (no encryption)",
      protocolHttps: "HTTPS (secure)",
      domainQuestion: "Do you have a domain name configured?",
      domainYes: "Yes",
      domainNo: "No",
      certMethodQuestion: "How would you like to manage SSL certificates?",
      certMethodAuto: "Automatic (recommended)",
      certMethodManual: "Manual",
      providerQuestion: "Which DNS provider manages your domain?",
      providers: {
        cloudflare: "Cloudflare",
        route53: "AWS Route53",
        gcloud: "Google Cloud DNS",
        azure: "Azure DNS",
        digitalocean: "DigitalOcean DNS",
        hetzner: "Hetzner DNS"
      },
      backButton: "Back",
      nextButton: "Next",
      generateButton: "Generate Config",
      resetButton: "Reset",
      configTitle: "Your config.env configuration:",
      copyButton: "Copy to Clipboard",
      copiedMessage: "Copied!",
      noteHttpOnly: "Note: Without a domain, HTTPS cannot be configured. Using HTTP only.",
      noteNoProvider: "Note: Your DNS provider is not supported for automatic certificate issuance. Please use manual certificate setup."
    },
    zh: {
      title: "SSL 配置",
      subtitle: "配置 SSL/TLS 设置以建立安全的 HTTPS 连接",
      protocolQuestion: "您希望通过以下方式提供 API：",
      protocolHttp: "HTTP（无加密）",
      protocolHttps: "HTTPS（安全）",
      domainQuestion: "您是否配置了域名？",
      domainYes: "是",
      domainNo: "否",
      certMethodQuestion: "您希望如何管理 SSL 证书？",
      certMethodAuto: "自动（推荐）",
      certMethodManual: "手动",
      providerQuestion: "哪个 DNS 提供商管理您的域名？",
      providers: {
        cloudflare: "Cloudflare",
        route53: "AWS Route53",
        gcloud: "Google Cloud DNS",
        azure: "Azure DNS",
        digitalocean: "DigitalOcean DNS",
        hetzner: "Hetzner DNS"
      },
      backButton: "返回",
      nextButton: "下一步",
      generateButton: "生成配置",
      resetButton: "重置",
      configTitle: "您的 config.env 配置：",
      copyButton: "复制到剪贴板",
      copiedMessage: "已复制！",
      noteHttpOnly: "注意：没有域名，无法配置 HTTPS。仅使用 HTTP。",
      noteNoProvider: "注意：您的 DNS 提供商不支持自动证书颁发。请使用手动证书设置。"
    }
  };

  // Detect current language (fallback to 'en')
  function getCurrentLanguage() {
    const htmlLang = document.documentElement.lang || 'en';
    const pathLang = window.location.pathname.split('/')[1];
    return (pathLang === 'zh' || htmlLang.startsWith('zh')) ? 'zh' : 'en';
  }

  // Get translations for current language
  function t(key) {
    const lang = getCurrentLanguage();
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || translations.en[key] || key;
  }

  // Get translated value from comment or editMemo object
  // Handles both old string format (for backward compatibility) and new object format
  function getTranslatedValue(value) {
    if (!value) return '';
    if (typeof value === 'string') return value; // Backward compatibility
    if (typeof value === 'object' && value !== null) {
      const lang = getCurrentLanguage();
      return value[lang] || value.en || '';
    }
    return '';
  }

  // Storage key for saving state
  const STORAGE_KEY = 'quickstart-questionnaire-state';

  // Configuration state - array of answer keys
  // Examples: ['protocolHttps', 'domainYes', 'certMethodAuto', 'cloudflare']
  // 'non-finished' is added initially and removed when questionnaire is completed
  let configState = ['non-finished'];

  // Save state to localStorage
  function saveState(state, currentStep) {
    try {
      const stateToSave = {
        configState: state,
        currentStep: currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save questionnaire state:', error);
    }
  }

  // Load state from localStorage
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if state is not too old (e.g., 7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        if (Date.now() - parsed.timestamp < maxAge) {
          return parsed;
        } else {
          // Clear old state
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load questionnaire state:', error);
    }
    return null;
  }

  // Clear saved state
  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear questionnaire state:', error);
    }
  }

  // All config rows with conditional rules
  // conditionalRules: array of answer keys that must be present in configState
  // If empty array, row is always included (default/base rows)
  // insertAfter: key name to insert this row after (for ordering)
  // providerPlaceholder: if true, value will be replaced with actual provider from configState
  const allConfigRows = [
    // Base rows (always present) - empty conditionalRules
    {
      key: 'KEY_NAME',
      value: '<FILLIN>',
      comment: { en: 'Edit as described below', zh: '按以下说明编辑' },
      conditionalRules: [],
      editMemo: { en: 'Manually define a unique identifier for your node.', zh: '手动为您的节点定义唯一标识符。' }
    },
    {
      key: 'KEYRING_PASSWORD',
      value: '<FILLIN>',
      comment: { en: 'Edit as described below', zh: '按以下说明编辑' },
      conditionalRules: [],
      editMemo: { en: 'Set a password for encrypting the ML Operational Key stored in the `file` keyring backend on the server.', zh: '设置密码以加密服务器上 `file` 密钥环后端中存储的 ML 运营密钥。' }
    },
    {
      key: 'ACCOUNT_PUBKEY',
      value: '<ACCOUNT_PUBKEY_FROM_STEP_ABOVE>',
      comment: { en: 'Use the pubkey from your Account Key (without quotes)', zh: '使用您的账户密钥的公钥（不带引号）' },
      conditionalRules: [],
      editMemo: { en: 'Use the public key from your Account Key created above (the value after `"key":` without quotes).', zh: '使用上面创建的账户密钥的公钥（`"key":` 后面的值，不带引号）。' }
    },
    {
      key: 'NODE_CONFIG',
      value: './node-config.json',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'HF_HOME',
      value: '/mnt/shared',
      comment: { en: 'Directory you used for cache', zh: '您用于缓存的目录' },
      conditionalRules: [],
      editMemo: { en: 'Set the path where Hugging Face models will be cached. Set this to a writable local directory (e.g., `~/hf-cache`).', zh: '设置 Hugging Face 模型缓存路径。将其设置为可写的本地目录（例如 `~/hf-cache`）。' }
    },
    {
      key: 'SEED_API_URL',
      value: 'http://node2.gonka.ai:8000',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'SEED_NODE_RPC_URL',
      value: 'http://node2.gonka.ai:26657',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'SEED_NODE_P2P_URL',
      value: 'tcp://node2.gonka.ai:5000',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'DAPI_API__POC_CALLBACK_URL',
      value: 'http://api:9100',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'DAPI_CHAIN_NODE__URL',
      value: 'http://node:26657',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'DAPI_CHAIN_NODE__P2P_URL',
      value: 'http://node:26656',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'RPC_SERVER_URL_1',
      value: 'http://node1.gonka.ai:26657',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'RPC_SERVER_URL_2',
      value: 'http://node2.gonka.ai:26657',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'PORT',
      value: '8080',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'INFERENCE_PORT',
      value: '5050',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    {
      key: 'KEYRING_BACKEND',
      value: 'file',
      comment: { en: 'Keep as is', zh: '保持原样' },
      conditionalRules: []
    },
    
    // Conditional rows - HTTP protocol
    {
      key: 'NGINX_MODE',
      value: 'http',
      comment: { en: 'HTTP mode', zh: 'HTTP 模式' },
      insertAfter: 'KEYRING_PASSWORD',
      conditionalRules: ['protocolHttp']
    },
    {
      key: 'API_PORT',
      value: '8000',
      comment: { en: 'HTTP port', zh: 'HTTP 端口' },
      insertAfter: 'NGINX_MODE',
      conditionalRules: ['protocolHttp'],
      editMemo: { en: 'Set the port where your node will be available on the machine (default is 8000).', zh: '设置节点在机器上可用的端口（默认为 8000）。' }
    },
    {
      key: 'PUBLIC_URL',
      value: 'http://<HOST>:<PORT>',
      comment: { en: 'Edit as described below', zh: '按以下说明编辑' },
      insertAfter: 'API_PORT',
      conditionalRules: ['protocolHttp'],
      editMemo: { en: 'Set the public URL where your node will be accessible (e.g., `http://your-domain.com:8000` or `http://your-ip:8000`).', zh: '设置节点可访问的公共 URL（例如 `http://your-domain.com:8000` 或 `http://your-ip:8000`）。' }
    },
    {
      key: 'P2P_EXTERNAL_ADDRESS',
      value: 'tcp://<HOST>:<PORT>',
      comment: { en: 'Edit as described below', zh: '按以下说明编辑' },
      insertAfter: 'PUBLIC_URL',
      conditionalRules: ['protocolHttp'],
      editMemo: { en: 'Set the P2P external address for your node (e.g., `tcp://your-domain.com:5000` or `tcp://your-ip:5000`).', zh: '设置节点的 P2P 外部地址（例如 `tcp://your-domain.com:5000` 或 `tcp://your-ip:5000`）。' }
    },
    
    // Conditional rows - HTTPS protocol
    {
      key: 'NGINX_MODE',
      value: 'https',
      comment: { en: 'HTTPS mode', zh: 'HTTPS 模式' },
      insertAfter: 'KEYRING_PASSWORD',
      conditionalRules: ['protocolHttps']
    },
    {
      key: 'API_SSL_PORT',
      value: '8443',
      comment: { en: 'HTTPS port', zh: 'HTTPS 端口' },
      insertAfter: 'NGINX_MODE',
      conditionalRules: ['protocolHttps'],
      editMemo: { en: 'Set the HTTPS port where your node will be available on the machine (default is 8443).', zh: '设置节点在机器上可用的 HTTPS 端口（默认为 8443）。' }
    },
    {
      key: 'PUBLIC_URL',
      value: 'https://<HOST>:<PORT>',
      comment: { en: 'Edit as described below', zh: '按以下说明编辑' },
      insertAfter: 'API_SSL_PORT',
      conditionalRules: ['protocolHttps'],
      editMemo: { en: 'Set the public URL where your node will be accessible (e.g., `https://your-domain.com:8443` or `https://your-domain.com`).', zh: '设置节点可访问的公共 URL（例如 `https://your-domain.com:8443` 或 `https://your-domain.com`）。' }
    },
    {
      key: 'P2P_EXTERNAL_ADDRESS',
      value: 'tcp://<HOST>:<PORT>',
      comment: { en: 'Edit as described below', zh: '按以下说明编辑' },
      insertAfter: 'PUBLIC_URL',
      conditionalRules: ['protocolHttps'],
      editMemo: { en: 'Set the P2P external address for your node (e.g., `tcp://your-domain.com:5000` or `tcp://your-ip:5000`).', zh: '设置节点的 P2P 外部地址（例如 `tcp://your-domain.com:5000` 或 `tcp://your-ip:5000`）。' }
    },
    
    // Conditional rows - Automatic certificate setup
    {
      key: 'CERT_ISSUER_DOMAIN',
      value: '<FULL_DOMAIN_NAME>',
      comment: { en: 'Your full domain name', zh: '您的完整域名' },
      insertAfter: 'KEYRING_BACKEND',
      conditionalRules: ['protocolHttps', 'certMethodAuto'],
      requiresProvider: true,
      editMemo: { en: 'Set your full domain name (e.g., `example.com` or `api.example.com`).', zh: '设置您的完整域名（例如 `example.com` 或 `api.example.com`）。' }
    },
    {
      key: 'CERT_ISSUER_JWT_SECRET',
      value: '<STRONG_SHARED_SECRET>',
      comment: { en: 'Strong shared secret', zh: '强共享密钥' },
      insertAfter: 'CERT_ISSUER_DOMAIN',
      conditionalRules: ['protocolHttps', 'certMethodAuto'],
      requiresProvider: true,
      editMemo: { en: 'Set a strong shared secret for certificate issuance. Generate a secure random string.', zh: '设置用于证书颁发的强共享密钥。生成安全的随机字符串。' }
    },
    {
      key: 'ACME_DNS_PROVIDER',
      value: '<PROVIDER>',
      comment: { en: 'DNS provider', zh: 'DNS 提供商' },
      insertAfter: 'CERT_ISSUER_JWT_SECRET',
      conditionalRules: ['protocolHttps', 'certMethodAuto'],
      requiresProvider: true,
      providerPlaceholder: true
      // No editMemo - this is auto-set and doesn't need to be edited
    },
    
    // Provider-specific environment variables
    // Cloudflare
    {
      key: 'CF_DNS_API_TOKEN',
      value: '<CF_DNS_API_TOKEN>',
      comment: { en: 'Cloudflare DNS API token', zh: 'Cloudflare DNS API 令牌' },
      insertAfter: 'ACME_DNS_PROVIDER',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'cloudflare'],
      editMemo: { en: 'Set your Cloudflare DNS API token. See instructions below for how to obtain it.', zh: '设置您的 Cloudflare DNS API 令牌。请参阅下面的说明以了解如何获取。' }
    },
    
    // AWS Route53
    {
      key: 'AWS_ACCESS_KEY_ID',
      value: '<AWS_ACCESS_KEY_ID>',
      comment: { en: 'AWS access key ID', zh: 'AWS 访问密钥 ID' },
      insertAfter: 'ACME_DNS_PROVIDER',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'route53'],
      editMemo: { en: 'Set your AWS access key ID. See instructions below for how to obtain it.', zh: '设置您的 AWS 访问密钥 ID。请参阅下面的说明以了解如何获取。' }
    },
    {
      key: 'AWS_SECRET_ACCESS_KEY',
      value: '<AWS_SECRET_ACCESS_KEY>',
      comment: { en: 'AWS secret access key', zh: 'AWS 密钥访问密钥' },
      insertAfter: 'AWS_ACCESS_KEY_ID',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'route53'],
      editMemo: { en: 'Set your AWS secret access key. See instructions below for how to obtain it.', zh: '设置您的 AWS 密钥访问密钥。请参阅下面的说明以了解如何获取。' }
    },
    {
      key: 'AWS_REGION',
      value: '<AWS_REGION>',
      comment: { en: 'AWS region', zh: 'AWS 区域' },
      insertAfter: 'AWS_SECRET_ACCESS_KEY',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'route53'],
      editMemo: { en: 'Set your AWS region (e.g., `us-east-1`). See instructions below for more details.', zh: '设置您的 AWS 区域（例如 `us-east-1`）。请参阅下面的说明以了解更多详细信息。' }
    },
    
    // Google Cloud DNS
    {
      key: 'GCE_PROJECT',
      value: '<GCE_PROJECT>',
      comment: { en: 'Google Cloud project ID', zh: 'Google Cloud 项目 ID' },
      insertAfter: 'ACME_DNS_PROVIDER',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'gcloud'],
      editMemo: { en: 'Set your Google Cloud project ID. See instructions below for how to obtain it.', zh: '设置您的 Google Cloud 项目 ID。请参阅下面的说明以了解如何获取。' }
    },
    {
      key: 'GCE_SERVICE_ACCOUNT_JSON_B64',
      value: '<GCE_SERVICE_ACCOUNT_JSON_B64>',
      comment: { en: 'Base64-encoded service account JSON', zh: 'Base64 编码的服务账户 JSON' },
      insertAfter: 'GCE_PROJECT',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'gcloud'],
      editMemo: { en: 'Set your base64-encoded Google Cloud service account JSON. See instructions below for how to obtain it.', zh: '设置您的 base64 编码的 Google Cloud 服务账户 JSON。请参阅下面的说明以了解如何获取。' }
    },
    
    // Azure DNS
    {
      key: 'AZURE_CLIENT_ID',
      value: '<AZURE_CLIENT_ID>',
      comment: { en: 'Azure client ID', zh: 'Azure 客户端 ID' },
      insertAfter: 'ACME_DNS_PROVIDER',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'azure'],
      editMemo: { en: 'Set your Azure client ID. See instructions below for how to obtain it.', zh: '设置您的 Azure 客户端 ID。请参阅下面的说明以了解如何获取。' }
    },
    {
      key: 'AZURE_CLIENT_SECRET',
      value: '<AZURE_CLIENT_SECRET>',
      comment: { en: 'Azure client secret', zh: 'Azure 客户端密钥' },
      insertAfter: 'AZURE_CLIENT_ID',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'azure'],
      editMemo: { en: 'Set your Azure client secret. See instructions below for how to obtain it.', zh: '设置您的 Azure 客户端密钥。请参阅下面的说明以了解如何获取。' }
    },
    {
      key: 'AZURE_TENANT_ID',
      value: '<AZURE_TENANT_ID>',
      comment: { en: 'Azure tenant ID', zh: 'Azure 租户 ID' },
      insertAfter: 'AZURE_CLIENT_SECRET',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'azure'],
      editMemo: { en: 'Set your Azure tenant ID. See instructions below for how to obtain it.', zh: '设置您的 Azure 租户 ID。请参阅下面的说明以了解如何获取。' }
    },
    {
      key: 'AZURE_SUBSCRIPTION_ID',
      value: '<AZURE_SUBSCRIPTION_ID>',
      comment: { en: 'Azure subscription ID', zh: 'Azure 订阅 ID' },
      insertAfter: 'AZURE_TENANT_ID',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'azure'],
      editMemo: { en: 'Set your Azure subscription ID. See instructions below for how to obtain it.', zh: '设置您的 Azure 订阅 ID。请参阅下面的说明以了解如何获取。' }
    },
    
    // DigitalOcean DNS
    {
      key: 'DO_AUTH_TOKEN',
      value: '<DO_AUTH_TOKEN>',
      comment: { en: 'DigitalOcean API token', zh: 'DigitalOcean API 令牌' },
      insertAfter: 'ACME_DNS_PROVIDER',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'digitalocean'],
      editMemo: { en: 'Set your DigitalOcean API token. See instructions below for how to obtain it.', zh: '设置您的 DigitalOcean API 令牌。请参阅下面的说明以了解如何获取。' }
    },
    
    // Hetzner DNS
    {
      key: 'HETZNER_API_KEY',
      value: '<HETZNER_API_KEY>',
      comment: { en: 'Hetzner DNS API key', zh: 'Hetzner DNS API 密钥' },
      insertAfter: 'ACME_DNS_PROVIDER',
      conditionalRules: ['protocolHttps', 'certMethodAuto', 'hetzner'],
      editMemo: { en: 'Set your Hetzner DNS API key. See instructions below for how to obtain it.', zh: '设置您的 Hetzner DNS API 密钥。请参阅下面的说明以了解如何获取。' }
    },
    
    // Conditional rows - Manual certificate setup
    {
      key: 'SERVER_NAME',
      value: '<FULL_DOMAIN_NAME>',
      comment: { en: 'Full domain name', zh: '完整域名' },
      insertAfter: 'KEYRING_BACKEND',
      conditionalRules: ['protocolHttps', 'certMethodManual', 'domainYes'],
      editMemo: { en: 'Set your full domain name (e.g., `example.com` or `api.example.com`).', zh: '设置您的完整域名（例如 `example.com` 或 `api.example.com`）。' }
    },
    {
      key: 'SSL_CERT_SOURCE',
      value: './secrets/nginx-ssl',
      comment: { en: 'Path to certificate files', zh: '证书文件路径' },
      insertAfter: 'SERVER_NAME',
      conditionalRules: ['protocolHttps', 'certMethodManual', 'domainYes'],
      editMemo: { en: 'Set the path to your SSL certificate files directory. Default is `./secrets/nginx-ssl`.', zh: '设置 SSL 证书文件目录的路径。默认为 `./secrets/nginx-ssl`。' }
    }
  ];

  // Build final config array with proper filtering and ordering
  function buildConfigArray() {
    // Ensure configState is always an array
    if (!Array.isArray(configState)) {
      console.warn('configState is not an array, resetting to empty array');
      configState = [];
    }
    
    const providers = ['cloudflare', 'route53', 'gcloud', 'azure', 'digitalocean', 'hetzner'];
    const provider = configState.find(key => providers.includes(key));
    
    // Filter rows based on conditionalRules
    const filteredRows = allConfigRows.filter(row => {
      // If conditionalRules is empty, always include (base rows)
      if (row.conditionalRules.length === 0) {
        return true;
      }
      
      // Check if all required keys are present in configState
      const allRulesSatisfied = row.conditionalRules.every(key => configState.includes(key));
      
      // If row requires a provider, also check that provider exists
      if (row.requiresProvider && allRulesSatisfied) {
        return provider !== undefined;
      }
      
      return allRulesSatisfied;
    });
    
    // Replace provider placeholder if needed
    const processedRows = filteredRows.map(row => {
      if (row.providerPlaceholder && provider) {
        return { ...row, value: provider };
      }
      return row;
    });
    
    // Separate base rows (no insertAfter) from conditional rows (with insertAfter)
    const baseRows = processedRows.filter(row => !row.insertAfter);
    const conditionalRows = processedRows.filter(row => row.insertAfter);
    
    // Start with base rows in their defined order
    const config = [...baseRows];
    
    // Insert conditional rows at specified positions
    // Process multiple times to handle nested dependencies (e.g., row B depends on row A which depends on base row)
    let maxIterations = conditionalRows.length;
    let remainingRows = [...conditionalRows];
    
    while (remainingRows.length > 0 && maxIterations > 0) {
      const beforeLength = remainingRows.length;
      remainingRows = remainingRows.filter(row => {
        const insertIndex = config.findIndex(r => r.key === row.insertAfter);
        if (insertIndex !== -1) {
          config.splice(insertIndex + 1, 0, row);
          return false; // Successfully inserted, remove from remaining
        }
        return true; // Keep in remaining for next iteration
      });
      
      // If no progress made, break to avoid infinite loop
      if (remainingRows.length === beforeLength) {
        // Append remaining rows at end
        remainingRows.forEach(row => config.push(row));
        break;
      }
      
      maxIterations--;
    }
    
    // Remove duplicate keys (keep first occurrence) - handles cases where same key appears multiple times
    const seen = new Set();
    const finalConfig = [];
    config.forEach(row => {
      if (!seen.has(row.key)) {
        seen.add(row.key);
        finalConfig.push(row);
      }
    });

    return finalConfig;
  }

  // Generate config.env content
  function generateConfig() {
    const config = buildConfigArray();
    
    // First pass: find the longest key+value combination
    let maxLength = 0;
    config.forEach(row => {
      const keyValuePart = `export ${row.key}=${row.value}`;
      if (keyValuePart.length > maxLength) {
        maxLength = keyValuePart.length;
      }
    });
    
    // Second pass: generate output with aligned comments
    let output = '';
    config.forEach(row => {
      const keyValuePart = `export ${row.key}=${row.value}`;
      // Calculate padding to align comments (add some extra space for readability)
      const paddingLength = maxLength + 4; // Add 4 extra spaces for better readability
      const padding = ' '.repeat(Math.max(1, paddingLength - keyValuePart.length));
      const commentText = getTranslatedValue(row.comment);
      output += `${keyValuePart}${padding}# ${commentText}\n`;
    });

    return output;
  }

  // Render config display and edit table
  function renderConfig() {
    const configDisplay = document.getElementById('quickstart-config-display');
    if (!configDisplay) return;

    const configText = generateConfig();
    const pre = configDisplay.querySelector('pre code');
    if (pre) {
      pre.textContent = configText;
    } else {
      configDisplay.innerHTML = `<pre><code>${configText}</code></pre>`;
    }
    
    // Render edit table
    const editTableContainer = document.getElementById('quickstart-edit-table');
    if (editTableContainer) {
      const config = buildConfigArray();
      const rowsToEdit = config.filter(row => row.editMemo);
      
      if (rowsToEdit.length > 0) {
        let html = '<table>\n<thead>\n<tr><th>Variable</th><th>What to do</th></tr>\n</thead>\n<tbody>\n';
        
        rowsToEdit.forEach(row => {
          // Convert markdown code blocks in editMemo to HTML
          const memoText = getTranslatedValue(row.editMemo);
          let memoHtml = memoText
            .replace(/`([^`]+)`/g, '<code>$1</code>');
          
          html += `<tr><td><code>${row.key}</code></td><td>${memoHtml}</td></tr>\n`;
        });
        
        html += '</tbody>\n</table>';
        editTableContainer.innerHTML = html;
      } else {
        editTableContainer.innerHTML = '';
      }
    }
    
    // Show/hide conditional sections based on data-show-when attributes
    updateConditionalSections();
  }
  
  // Update visibility of all elements with data-show-when attributes
  function updateConditionalSections() {
    // Ensure configState is always an array
    if (!Array.isArray(configState)) {
      configState = [];
    }
    
    // Find all elements with data-show-when attribute
    const conditionalElements = document.querySelectorAll('[data-show-when]');
    
    conditionalElements.forEach(element => {
      const showWhenAttr = element.getAttribute('data-show-when');
      
      // Skip if attribute is empty or missing
      if (!showWhenAttr || showWhenAttr.trim() === '') {
        console.warn('Empty or missing data-show-when attribute on element:', element);
        element.classList.remove('quickstart-visible');
        return;
      }
      
      try {
        // Parse the JSON array of required keys
        const requiredKeys = JSON.parse(showWhenAttr);
        
        // Validate that we got an array
        if (!Array.isArray(requiredKeys)) {
          console.warn('data-show-when attribute is not a JSON array:', showWhenAttr);
          element.classList.remove('quickstart-visible');
          return;
        }
        
        // Check if all required keys are present in configState
        const allKeysPresent = requiredKeys.every(key => configState.includes(key));
        
        // Toggle visibility class instead of inline style
        // This preserves markdown styling while allowing JS control
        if (allKeysPresent) {
          element.classList.add('quickstart-visible');
        } else {
          element.classList.remove('quickstart-visible');
        }
      } catch (error) {
        console.warn('Failed to parse data-show-when attribute:', showWhenAttr, 'Error:', error);
        // Hide element if parsing fails
        element.classList.remove('quickstart-visible');
      }
    });
    
    // Update TOC visibility based on conditional sections
    updateTOCVisibility();
  }
  
  // Hide TOC items that link to headings within hidden conditional sections
  function updateTOCVisibility() {
    // Find all conditional sections
    const conditionalSections = document.querySelectorAll('.quickstart-conditional');
    
    // Get all TOC links
    const tocLinks = document.querySelectorAll('.md-nav__link[href^="#"]');
    
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      // Find the target element (heading) that this TOC link points to
      try {
        const targetId = href.substring(1); // Remove the #
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) return;
        
        // Check if this target is inside a hidden conditional section
        let isHidden = false;
        conditionalSections.forEach(section => {
          if (!section.classList.contains('quickstart-visible') && section.contains(targetElement)) {
            isHidden = true;
          }
        });
        
        // Hide/show the TOC item (find the parent list item)
        const tocItem = link.closest('.md-nav__item');
        if (tocItem) {
          if (isHidden) {
            tocItem.style.display = 'none';
          } else {
            tocItem.style.display = '';
          }
        }
      } catch (error) {
        // Silently ignore errors (e.g., invalid IDs)
      }
    });
  }

  // Track if already initialized to prevent multiple initializations
  let initialized = false;

  // Initialize questionnaire
  function initQuestionnaire() {
    const container = document.getElementById('quickstart-questionnaire');
    if (!container) {
      return; // Container not found yet, will retry
    }

    // Prevent multiple initializations
    if (initialized) {
      return;
    }

    // Check if questions div exists
    const questionsDiv = document.getElementById('quickstart-questions');
    if (!questionsDiv) {
      console.log('Quickstart questions div not found, will retry');
      return; // Questions div not found yet
    }

    initialized = true;
    console.log('Initializing quickstart questionnaire...');

    // Try to restore saved state
    const savedState = loadState();
    let currentStep = 0;
    if (savedState && savedState.configState) {
      // Ensure configState is always an array
      // Handle migration from old object format to new array format
      if (Array.isArray(savedState.configState)) {
        configState = savedState.configState;
      } else if (typeof savedState.configState === 'object') {
        // Convert old object format to new array format
        configState = [];
        if (savedState.configState.protocol === 'http') configState.push('protocolHttp');
        if (savedState.configState.protocol === 'https') configState.push('protocolHttps');
        if (savedState.configState.hasDomain === true) configState.push('domainYes');
        if (savedState.configState.hasDomain === false) configState.push('domainNo');
        if (savedState.configState.certMethod === 'auto') configState.push('certMethodAuto');
        if (savedState.configState.certMethod === 'manual') configState.push('certMethodManual');
        if (savedState.configState.provider) configState.push(savedState.configState.provider);
      } else {
        // Fallback to empty array if state is invalid
        configState = [];
      }
      // Ensure non-finished or finished state is present
      if (!configState.includes('non-finished') && !configState.includes('finished')) {
        configState.push('non-finished');
      }
      currentStep = savedState.currentStep || 0;
      console.log('Restored saved questionnaire state:', configState, 'step:', currentStep);
    }

    const lang = getCurrentLanguage();
    const t = (key) => {
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        value = value?.[k];
      }
      // Fallback to English if not found
      if (!value) {
        value = translations.en;
        for (const k of keys) {
          value = value?.[k];
        }
      }
      return value || key;
    };

    const steps = [];

    // Step 1: Protocol selection
    steps.push({
      question: t('protocolQuestion'),
      options: [
        { 
          value: 'http', 
          label: t('protocolHttp'), 
          next: () => { 
            // Remove any existing protocol keys and add protocolHttp
            configState = configState.filter(k => !k.startsWith('protocol'));
            configState.push('protocolHttp');
            return -1; 
          } 
        },
        { 
          value: 'https', 
          label: t('protocolHttps'), 
          next: () => { 
            // Remove any existing protocol keys and add protocolHttps
            configState = configState.filter(k => !k.startsWith('protocol'));
            configState.push('protocolHttps');
            return 1; 
          } 
        }
      ]
    });

    // Step 2: Domain check (only for HTTPS)
    steps.push({
      question: t('domainQuestion'),
      options: [
        { 
          value: 'yes', 
          label: t('domainYes'), 
          next: () => { 
            // Remove any existing domain keys and add domainYes
            configState = configState.filter(k => !k.startsWith('domain'));
            configState.push('domainYes');
            return 2; 
          } 
        },
        { 
          value: 'no', 
          label: t('domainNo'), 
          next: () => { 
            // Remove any existing domain keys and add domainNo
            // Also switch to HTTP if HTTPS was selected
            configState = configState.filter(k => !k.startsWith('domain') && !k.startsWith('protocol'));
            configState.push('domainNo');
            configState.push('protocolHttp');
            return -1; 
          } 
        }
      ]
    });

    // Step 3: Certificate method
    steps.push({
      question: t('certMethodQuestion'),
      options: [
        { 
          value: 'auto', 
          label: t('certMethodAuto'), 
          next: () => { 
            // Remove any existing cert method keys and add certMethodAuto
            configState = configState.filter(k => !k.startsWith('certMethod'));
            configState.push('certMethodAuto');
            return 3; 
          } 
        },
        { 
          value: 'manual', 
          label: t('certMethodManual'), 
          next: () => { 
            // Remove any existing cert method keys and provider keys, add certMethodManual
            configState = configState.filter(k => !k.startsWith('certMethod') && !['cloudflare', 'route53', 'gcloud', 'azure', 'digitalocean', 'hetzner'].includes(k));
            configState.push('certMethodManual');
            return -1; 
          } 
        }
      ]
    });

    // Step 4: DNS Provider selection
    steps.push({
      question: t('providerQuestion'),
      options: Object.keys(translations.en.providers).map(key => ({
        value: key,
        label: t(`providers.${key}`),
        next: () => {
          // Remove any existing provider keys and add the selected provider
          const providers = ['cloudflare', 'route53', 'gcloud', 'azure', 'digitalocean', 'hetzner'];
          configState = configState.filter(k => !providers.includes(k));
          configState.push(key);
          return -1;
        }
      }))
    });

    function renderStep(stepIndex) {
      if (stepIndex === -1) {
        // Show config and hide placeholder
        // Add "finished" to configState when questionnaire is completed
        // Remove "non-finished" when finished
        if (!configState.includes('finished')) {
          configState.push('finished');
        }
        // Remove non-finished state
        configState = configState.filter(key => key !== 'non-finished');
        renderConfig();
        const questionsDiv = document.getElementById('quickstart-questions');
        const resultDiv = document.getElementById('quickstart-config-result');
        if (questionsDiv) questionsDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'block';
        // Save completed state
        saveState(configState, -1);
        // Update conditional sections to show "Edit Environment Variables"
        updateConditionalSections();
        return;
      }

      if (stepIndex >= steps.length) {
        // Add "finished" to configState when questionnaire is completed
        // Remove "non-finished" when finished
        if (!configState.includes('finished')) {
          configState.push('finished');
        }
        // Remove non-finished state
        configState = configState.filter(key => key !== 'non-finished');
        renderConfig();
        const questionsDiv = document.getElementById('quickstart-questions');
        const resultDiv = document.getElementById('quickstart-config-result');
        if (questionsDiv) questionsDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'block';
        // Save completed state
        saveState(configState, -1);
        // Update conditional sections to show "Edit Environment Variables"
        updateConditionalSections();
        return;
      }

      const step = steps[stepIndex];
      if (!step || !step.options || step.options.length === 0) {
        console.error('Invalid step at index', stepIndex, step);
        return;
      }

      const questionsDiv = document.getElementById('quickstart-questions');
      if (!questionsDiv) {
        console.error('quickstart-questions div not found');
        return;
      }

      // Ensure questions div is visible
      questionsDiv.style.display = 'block';
      
      // Add instruction text for final step
      const isLastStep = stepIndex === steps.length - 1;
      const instructionText = isLastStep ? '<p style="margin-top: 1rem; font-size: 0.7rem; line-height: 1.5; color: var(--md-default-fg-color--light);">After generating your configuration, proceed to the next section below to edit the values.</p>' : '';
      
      questionsDiv.innerHTML = `
        <div class="quickstart-question">
          <h4>${step.question}</h4>
          <div class="quickstart-options">
            ${step.options.map(opt => `
              <button class="quickstart-option-btn" data-value="${opt.value}">
                ${opt.label}
              </button>
            `).join('')}
          </div>
          ${stepIndex > 0 ? `<button class="quickstart-back-btn">${t('backButton')}</button>` : ''}
          ${instructionText}
        </div>
      `;
      
      console.log('Rendered step', stepIndex, 'with', step.options.length, 'options');

      // Attach event listeners
      step.options.forEach(opt => {
        const btn = questionsDiv.querySelector(`[data-value="${opt.value}"]`);
        if (btn) {
          btn.addEventListener('click', () => {
            const nextStep = opt.next();
            currentStep = nextStep;
            // Save state before moving to next step
            saveState(configState, currentStep);
            renderStep(nextStep);
            // Update conditional sections when state changes
            updateConditionalSections();
          });
        }
      });

      const backBtn = questionsDiv.querySelector('.quickstart-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          currentStep = Math.max(0, stepIndex - 1);
          // Save state when going back
          saveState(configState, currentStep);
          renderStep(currentStep);
          // Update conditional sections when state changes
          updateConditionalSections();
        });
      }
    }

    // Reset button
    const resetBtn = container.querySelector('.quickstart-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        configState = ['non-finished']; // Reset to initial state with non-finished
        currentStep = 0;
        // Clear saved state when resetting
        clearState();
        const resultDiv = document.getElementById('quickstart-config-result');
        const questionsDiv = document.getElementById('quickstart-questions');
        if (resultDiv) resultDiv.style.display = 'none';
        if (questionsDiv) questionsDiv.style.display = 'block';
        renderStep(0);
        // Update conditional sections when resetting
        updateConditionalSections();
      });
    }

    // Copy button
    const copyBtn = container.querySelector('.quickstart-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const configText = generateConfig();
        navigator.clipboard.writeText(configText).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = t('copiedMessage');
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        });
      });
    }

    // Verify steps were created
    if (steps.length === 0) {
      console.error('No steps created!');
      return;
    }

    // Update conditional sections on initialization
    updateConditionalSections();
    
    // Start with restored step or first step
    // If currentStep is -1, it means we have a completed config - show it
    if (currentStep === -1) {
      console.log('Quickstart questionnaire: Restoring completed configuration');
      // Ensure finished state is set and non-finished is removed
      if (!configState.includes('finished')) {
        configState.push('finished');
      }
      configState = configState.filter(key => key !== 'non-finished');
      renderStep(-1);
      // Update conditional sections when restoring state
      updateConditionalSections();
    } else {
      console.log('Quickstart questionnaire initialized with', steps.length, 'steps, rendering step', currentStep);
      // Ensure non-finished state is present when starting questionnaire
      if (!configState.includes('non-finished') && !configState.includes('finished')) {
        configState.push('non-finished');
      }
      renderStep(currentStep);
      // Update conditional sections after rendering step
      updateConditionalSections();
    }
  }

  // Process comment-based conditional sections
  // Finds <!-- CONDITION START: data-show-when='...' --> ... <!-- CONDITION END --> markers
  // and wraps content in conditional divs so markdown is processed first
  function processCommentMarkers() {
    // Find all comment nodes in the document
    const allComments = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_COMMENT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      allComments.push(node);
    }
    
    // Process CONDITION START markers (in reverse order to avoid index issues when removing)
    for (let i = allComments.length - 1; i >= 0; i--) {
      const comment = allComments[i];
      const commentText = comment.textContent.trim();
      
      if (commentText.startsWith('CONDITION START:')) {
        // Extract data-show-when attribute
        // Match both single and double quotes, and handle escaped quotes
        const match = commentText.match(/data-show-when=(['"])((?:(?!\1).)*)\1/);
        if (match && match[2]) {
          const condition = match[2].trim();
          
          // Validate that condition looks like a JSON array
          if (!condition.startsWith('[') || !condition.endsWith(']')) {
            console.warn('Invalid condition format in CONDITION START comment (should be JSON array):', condition);
            continue;
          }
          
          // Find the matching CONDITION END comment
          let currentNode = comment.nextSibling;
          const contentNodes = [];
          let endComment = null;
          
          // Collect all nodes until we find the CONDITION END comment
          while (currentNode) {
            if (currentNode.nodeType === Node.COMMENT_NODE && currentNode.textContent.trim() === 'CONDITION END') {
              endComment = currentNode;
              break;
            }
            // Store reference to node before moving
            const nextSibling = currentNode.nextSibling;
            contentNodes.push(currentNode);
            currentNode = nextSibling;
          }
          
          if (endComment && contentNodes.length > 0) {
            // Create wrapper div
            const wrapper = document.createElement('div');
            wrapper.className = 'quickstart-conditional';
            
            // Ensure condition is properly formatted as JSON array string
            // The condition from the comment should already be in the right format
            if (condition && condition.trim() !== '') {
              // Validate it's valid JSON before setting
              try {
                JSON.parse(condition);
                wrapper.setAttribute('data-show-when', condition);
              } catch (e) {
                console.warn('Invalid JSON in condition, skipping wrapper creation:', condition, e);
                return;
              }
            } else {
              console.warn('Empty condition in CONDITION START comment, skipping wrapper creation');
              return;
            }
            
            // Move all content nodes into wrapper
            contentNodes.forEach(contentNode => {
              wrapper.appendChild(contentNode);
            });
            
            // Insert wrapper where the START comment was
            comment.parentNode.insertBefore(wrapper, comment);
            
            // Remove comment markers
            comment.remove();
            if (endComment) endComment.remove();
          }
        }
      }
    }
  }

  // Initialize when DOM is ready
  // Use multiple strategies to ensure initialization
  function tryInit() {
    try {
      // Process comment markers first (so markdown is already rendered)
      processCommentMarkers();
      // Then initialize questionnaire
      initQuestionnaire();
    } catch (error) {
      console.error('Error initializing SSL questionnaire:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    // If DOM is already loaded, try immediately and also after a short delay
    // to handle cases where MkDocs might still be processing content
    tryInit();
    setTimeout(tryInit, 100);
    setTimeout(tryInit, 500);
  }

  // Also try when window loads (for MkDocs)
  window.addEventListener('load', tryInit);
})();

