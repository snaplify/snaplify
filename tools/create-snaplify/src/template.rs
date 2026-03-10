use crate::prompts::InstanceConfig;

pub fn render_env(config: &InstanceConfig) -> String {
    format!(
        r#"# Snaplify Instance: {name}

# Database
DATABASE_URL={database_url}

# Redis
REDIS_URL={redis_url}

# Auth
AUTH_SECRET=change-me-in-production-min-32-chars
AUTH_URL=http://{domain}

# Instance
INSTANCE_DOMAIN={domain}
INSTANCE_NAME={name}
INSTANCE_DESCRIPTION={description}

# Feature Flags
FEATURE_COMMUNITIES={communities}
FEATURE_DOCS={docs}
FEATURE_LEARNING={learning}
FEATURE_EXPLAINERS={explainers}
FEATURE_FEDERATION={federation}
FEATURE_ADMIN={admin}
"#,
        name = config.name,
        domain = config.domain,
        description = config.description,
        database_url = config.database_url,
        redis_url = config.redis_url,
        communities = config.feature_communities,
        docs = config.feature_docs,
        learning = config.feature_learning,
        explainers = config.feature_explainers,
        federation = config.feature_federation,
        admin = config.feature_admin,
    )
}

pub fn render_config(config: &InstanceConfig) -> String {
    format!(
        r#"import {{ defineSnaplifyConfig }} from '@snaplify/config';

export default defineSnaplifyConfig({{
  instance: {{
    name: '{name}',
    domain: '{domain}',
    description: '{description}',
  }},
  theme: '{theme}',
  features: {{
    communities: {communities},
    docs: {docs},
    learning: {learning},
    explainers: {explainers},
    federation: {federation},
    admin: {admin},
  }},
}});
"#,
        name = config.name,
        domain = config.domain,
        description = config.description,
        theme = config.theme,
        communities = config.feature_communities,
        docs = config.feature_docs,
        learning = config.feature_learning,
        explainers = config.feature_explainers,
        federation = config.feature_federation,
        admin = config.feature_admin,
    )
}

pub fn render_package_json(config: &InstanceConfig) -> String {
    format!(
        r#"{{
  "name": "{name}",
  "private": true,
  "type": "module",
  "scripts": {{
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  }},
  "dependencies": {{
    "@snaplify/config": "latest",
    "@snaplify/schema": "latest",
    "@snaplify/auth": "latest",
    "@snaplify/ui": "latest"
  }},
  "devDependencies": {{
    "@sveltejs/adapter-node": "^5",
    "@sveltejs/kit": "^2",
    "svelte": "^5",
    "vite": "^6"
  }}
}}
"#,
        name = config.name,
    )
}

pub fn render_docker_compose(_config: &InstanceConfig) -> String {
    r#"services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: snaplify
      POSTGRES_PASSWORD: snaplify_dev
      POSTGRES_DB: snaplify
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U snaplify']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 5

  meilisearch:
    image: getmeili/meilisearch:v1.12
    restart: unless-stopped
    ports:
      - '7700:7700'
    environment:
      MEILI_ENV: development
      MEILI_MASTER_KEY: snaplify_dev_key
    volumes:
      - meili_data:/meili_data

volumes:
  postgres_data:
  redis_data:
  meili_data:
"#
    .to_string()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::prompts::InstanceConfig;

    fn test_config() -> InstanceConfig {
        InstanceConfig::with_defaults("test-instance")
    }

    #[test]
    fn env_contains_database_url() {
        let env = render_env(&test_config());
        assert!(env.contains("DATABASE_URL="));
        assert!(env.contains("postgresql://"));
    }

    #[test]
    fn env_contains_feature_flags() {
        let env = render_env(&test_config());
        assert!(env.contains("FEATURE_COMMUNITIES=true"));
        assert!(env.contains("FEATURE_FEDERATION=false"));
        assert!(env.contains("FEATURE_ADMIN=false"));
    }

    #[test]
    fn env_contains_instance_identity() {
        let config = test_config();
        let env = render_env(&config);
        assert!(env.contains("INSTANCE_NAME=test-instance"));
        assert!(env.contains("INSTANCE_DOMAIN=test-instance.localhost"));
    }

    #[test]
    fn config_is_valid_typescript_structure() {
        let config = render_config(&test_config());
        assert!(config.contains("import { defineSnaplifyConfig }"));
        assert!(config.contains("export default defineSnaplifyConfig"));
        assert!(config.contains("theme: 'base'"));
    }

    #[test]
    fn config_contains_feature_flags() {
        let config = render_config(&test_config());
        assert!(config.contains("communities: true"));
        assert!(config.contains("federation: false"));
    }

    #[test]
    fn config_uses_selected_theme() {
        let mut config = test_config();
        config.theme = "deepwood".to_string();
        let output = render_config(&config);
        assert!(output.contains("theme: 'deepwood'"));
    }

    #[test]
    fn package_json_has_instance_name() {
        let json = render_package_json(&test_config());
        assert!(json.contains("\"name\": \"test-instance\""));
    }

    #[test]
    fn package_json_has_snaplify_deps() {
        let json = render_package_json(&test_config());
        assert!(json.contains("@snaplify/config"));
        assert!(json.contains("@snaplify/schema"));
        assert!(json.contains("@snaplify/auth"));
        assert!(json.contains("@snaplify/ui"));
    }

    #[test]
    fn docker_compose_has_all_services() {
        let compose = render_docker_compose(&test_config());
        assert!(compose.contains("postgres:"));
        assert!(compose.contains("redis:"));
        assert!(compose.contains("meilisearch:"));
    }

    #[test]
    fn docker_compose_has_health_checks() {
        let compose = render_docker_compose(&test_config());
        assert!(compose.contains("healthcheck:"));
        assert!(compose.contains("pg_isready"));
        assert!(compose.contains("redis-cli"));
    }

    #[test]
    fn default_config_values_correct() {
        let config = InstanceConfig::with_defaults("my-app");
        assert_eq!(config.name, "my-app");
        assert_eq!(config.domain, "my-app.localhost");
        assert_eq!(config.theme, "base");
        assert!(config.feature_communities);
        assert!(config.feature_docs);
        assert!(!config.feature_federation);
        assert!(!config.feature_admin);
        assert!(config.use_docker);
    }
}
