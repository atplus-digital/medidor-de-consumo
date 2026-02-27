# ⚡ Medidor de Consumo

Sistema web moderno para monitoramento e análise de consumo de energia elétrica em tempo real. Desenvolvido para integração com dispositivos IoT e medidores inteligentes.

## 🚀 Tecnologias

### Core
- **[React 19](https://react.dev/)** - Interface de usuário
- **[TanStack Start](https://tanstack.com/start)** - Framework full-stack React com SSR
- **[TanStack Router](https://tanstack.com/router)** - Roteamento moderno e type-safe
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado assíncrono
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[Nitro](https://nitro.unjs.io/)** - Server-side runtime

### UI/UX
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis headless
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos React
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[date-fns](https://date-fns.org/)** - Manipulação de datas

### Backend & Database
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript-first
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validadores Zod

### Development
- **[Biome](https://biomejs.dev/)** - Linter e formatter moderno
- **[Vitest](https://vitest.dev/)** - Framework de testes

## 📁 Estrutura do Projeto

```
medidor-de-consumo/
├── drizzle/                        # Migrations do banco de dados
│   ├── 0000_create-energy-log-table.sql
│   ├── 0001_create-meters-table.sql
│   └── meta/
│
├── public/                         # Assets estáticos
│   ├── browserconfig.xml
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── api/                        # API handlers
│   │   ├── energy.ts               # Endpoint para logging de energia
│   │   └── index.ts                # Utilitários de resposta JSON
│   │
│   ├── app/                        # Páginas e features
│   │   ├── charts/                 # Visualização de gráficos
│   │   │   ├── charts.tsx
│   │   │   └── components/
│   │   │       └── consumption-chart.tsx
│   │   │
│   │   ├── dashboard/              # Dashboard principal
│   │   │   ├── dashboard.tsx
│   │   │   ├── components/
│   │   │   │   ├── dashboard-header.tsx
│   │   │   │   ├── real-time-reading.tsx
│   │   │   │   ├── stat-card.tsx
│   │   │   │   └── stats/
│   │   │   └── context/
│   │   │       └── dashboard-context.tsx
│   │   │
│   │   ├── meters/                 # Gerenciamento de medidores
│   │   │   ├── meters.tsx
│   │   │   ├── meter-form/         # Formulário de criação/edição
│   │   │   │   ├── meter-form.tsx
│   │   │   │   ├── meter-form-dialog.tsx
│   │   │   │   ├── meter-form.constants.ts
│   │   │   │   ├── use-meter-form.ts
│   │   │   │   └── components/
│   │   │   └── meters-list/        # Listagem de medidores
│   │   │       ├── meters-list.tsx
│   │   │       ├── meters-list-state.tsx
│   │   │       ├── use-meters-list.ts
│   │   │       └── meter-card/
│   │   │
│   │   └── reports/                # Relatórios e exportação
│   │       ├── reports.tsx
│   │       ├── components/
│   │       ├── context/
│   │       │   └── reports-context.tsx
│   │       ├── data-table/
│   │       │   └── energy-table.tsx
│   │       └── export/
│   │           └── export-buttons.tsx
│   │
│   ├── components/                 # Componentes compartilhados
│   │   ├── filters/
│   │   │   ├── date-range-picker.tsx
│   │   │   └── meter-select.tsx
│   │   ├── layout/
│   │   │   ├── app-header.tsx
│   │   │   ├── app-layout.tsx
│   │   │   └── root-layout.tsx
│   │   ├── ui/                     # Componentes base (Radix UI + shadcn)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── empty.tsx
│   │   │   ├── field.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   └── tabs.tsx
│   │   └── mode-toggle.tsx
│   │
│   ├── contexts/                   # Contextos React
│   │   ├── energy-filters-context/
│   │   │   └── energy-filters-context.tsx
│   │   └── theme-context/
│   │       ├── theme-context.tsx
│   │       ├── theme-provider.tsx
│   │       └── use-theme.tsx
│   │
│   ├── db/                         # Banco de dados
│   │   ├── index.ts                # Instância Drizzle
│   │   └── schema/                 # Schemas Drizzle
│   │       ├── index.ts
│   │       ├── energy.ts           # Tabela energy_log + tipos
│   │       └── meters.ts           # Tabela meters + validações
│   │
│   ├── integrations/               # Integrações de terceiros
│   │   └── tanstack-query/
│   │       ├── devtools.tsx
│   │       └── root-provider.tsx
│   │
│   ├── lib/                        # Utilitários
│   │   ├── format.ts               # Formatação de números e datas
│   │   └── utils.ts                # Utilitários gerais (cn)
│   │
│   ├── routes/                     # Definição de rotas
│   │   ├── __root.tsx              # Layout raiz
│   │   ├── index.tsx               # / (Dashboard)
│   │   ├── charts.tsx              # /charts
│   │   ├── meters.tsx              # /meters
│   │   ├── reports.tsx             # /reports
│   │   └── api/
│   │       └── energy.ts           # POST /api/energy
│   │
│   ├── server/                     # Server functions
│   │   ├── energy.ts               # Funções do servidor de energia
│   │   └── meters.ts               # Funções do servidor de medidores
│   │
│   ├── services/                   # Lógica de negócio
│   │   ├── energy/
│   │   │   ├── get-consumption-by-period.ts
│   │   │   ├── get-energy-logs.ts
│   │   │   ├── get-energy-meters.ts
│   │   │   ├── get-energy-stats.ts
│   │   │   ├── get-latest-reading.ts
│   │   │   ├── log-energy.ts
│   │   │   └── index.ts
│   │   ├── export/
│   │   │   ├── download-blob.ts
│   │   │   ├── export-to-csv.ts
│   │   │   ├── export-to-pdf.ts
│   │   │   └── index.ts
│   │   └── meters/
│   │       ├── create-meter.ts
│   │       ├── delete-meter.ts
│   │       ├── generate-meter-id.ts
│   │       ├── get-meter-by-id.ts
│   │       ├── get-meters.ts
│   │       ├── update-meter.ts
│   │       └── index.ts
│   │
│   ├── env.ts                      # Validação de variáveis de ambiente
│   ├── router.tsx                  # Configuração do router
│   ├── routeTree.gen.ts            # Árvore de rotas gerada
│   └── styles.css                  # Estilos globais
│
├── biome.json                      # Configuração Biome
├── components.json                 # Configuração shadcn/ui
├── drizzle.config.ts               # Configuração Drizzle
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json                   # Configuração TypeScript
└── vite.config.ts                  # Configuração Vite
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: `meters`
Armazena informações dos medidores cadastrados.

| Campo        | Tipo         | Descrição                                    |
|--------------|--------------|----------------------------------------------|
| meter_id     | VARCHAR(100) | ID único do medidor (PK)                     |
| meter_name   | VARCHAR(255) | Nome descritivo                              |
| meter_type   | VARCHAR(50)  | Tipo/modelo do medidor                       |
| location     | VARCHAR(255) | Localização física                           |
| status       | VARCHAR(50)  | Status: active, inactive, maintenance        |
| prefix       | VARCHAR(50)  | Prefixo usado na geração do ID               |
| is_inverted  | BOOLEAN      | Se o medidor está instalado invertido        |
| created_at   | TIMESTAMP    | Data de criação                              |
| updated_at   | TIMESTAMP    | Data da última atualização                   |

### Tabela: `energy_log`
Registra as leituras de energia dos medidores.

| Campo            | Tipo              | Descrição                                    |
|------------------|-------------------|----------------------------------------------|
| id               | INTEGER           | ID sequencial (PK)                           |
| meter_id         | VARCHAR(100)      | ID do medidor (FK → meters)                  |
| active_power     | DOUBLE PRECISION  | Potência ativa (W)                           |
| reactive_power   | DOUBLE PRECISION  | Potência reativa (VAR)                       |
| apparent_power   | DOUBLE PRECISION  | Potência aparente (VA)                       |
| voltage          | DOUBLE PRECISION  | Tensão (V)                                   |
| current          | DOUBLE PRECISION  | Corrente (A)                                 |
| power_factor     | DOUBLE PRECISION  | Fator de potência                            |
| phase_angle      | DOUBLE PRECISION  | Ângulo de fase (°)                           |
| frequency        | DOUBLE PRECISION  | Frequência (Hz)                              |
| consumed_energy  | DOUBLE PRECISION  | Energia consumida (kWh)                      |
| generated_energy | DOUBLE PRECISION  | Energia gerada (kWh)                         |
| operation_time   | DOUBLE PRECISION  | Tempo de operação (s)                        |
| raw_data         | JSONB             | Dados brutos do dispositivo                  |
| created_at       | TIMESTAMP         | Data/hora da leitura                         |

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+

### 1. Clone o repositório
```bash
git clone https://github.com/atplus-digital/medidor-de-consumo.git
cd medidor-de-consumo
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medidor_consumo

# Server (opcional)
SERVER_URL=http://localhost:3000

# App (opcional)
VITE_APP_TITLE=Medidor de Consumo
```

### 4. Execute as migrations
```bash
pnpm db:push
```

### 5. Inicie o servidor de desenvolvimento
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📜 Scripts Disponíveis

| Script          | Descrição                                      |
|-----------------|------------------------------------------------|
| `pnpm dev`      | Inicia o servidor de desenvolvimento           |
| `pnpm build`    | Compila o projeto para produção               |
| `pnpm start`    | Inicia o servidor de produção                  |
| `pnpm preview`  | Preview da build de produção                   |
| `pnpm test`     | Executa os testes                              |
| `pnpm format`   | Formata o código com Biome                     |
| `pnpm lint`     | Executa o linter                               |
| `pnpm check`    | Executa linter e formatter                     |
| `pnpm db:generate` | Gera migrations do banco                    |
| `pnpm db:migrate`  | Executa migrations                          |
| `pnpm db:push`     | Sincroniza schema com o banco               |
| `pnpm db:pull`     | Puxa schema do banco                        |
| `pnpm db:studio`   | Abre Drizzle Studio                         |

## 🌟 Funcionalidades

### Dashboard
- **Leitura em Tempo Real**: Monitoramento ao vivo das medições elétricas
- **Estatísticas**: Energia consumida, potência média, pico de potência, fator de potência
- **Gráfico de Consumo**: Visualização dos últimos 7 dias
- **Filtro por Medidor**: Visualização específica por medidor
- **Atualização Automática**: Refresh a cada 10 segundos

### Gráficos
- **Múltiplos Períodos**: Visualização diária, semanal e mensal
- **Tipos de Gráfico**: Área, barras e linha
- **Dados Consolidados**: Consumo, geração, potência, tensão
- **Filtros Avançados**: Por período e medidor

### Relatórios
- **Tabela Detalhada**: Todos os registros de energia com paginação
- **Exportação**: Download em PDF e CSV
- **Estatísticas**: Resumo consolidado do período selecionado
- **Filtros**: Data de início/fim e medidor específico

### Medidores
- **CRUD Completo**: Criar, visualizar, editar e excluir medidores
- **Geração de ID**: ID único automático com prefixo opcional
- **Inversão de Polaridade**: Suporte para medidores instalados invertidos
- **Status**: Gestão de status (ativo, inativo, manutenção)
- **Visualização**: Cards com informações detalhadas

### Temas
- **Light/Dark Mode**: Suporte a tema claro e escuro
- **Preferência do Sistema**: Detecção automática
- **Persistência**: Tema salvo no localStorage

## 🔌 API

### POST `/api/energy`
Registra uma nova leitura de energia (chamado por dispositivos IoT).

**Request Body:**
```json
{
  "id": "meter-123",
  "pa": "1500.5",
  "qa": "200.3",
  "sa": "1520.8",
  "uarms": "220.5",
  "iarms": "6.82",
  "pfa": "0.987",
  "pga": "8.5",
  "freq": "60.0",
  "epa_c": "125.45",
  "epa_g": "0.0",
  "tpsd": "86400"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Energy log saved successfully"
  }
}
```

## 🎨 Padrões de Código

### Convenções
- Componentes: PascalCase
- Funções/Hooks: camelCase
- Constantes: UPPER_SNAKE_CASE
- Arquivos: kebab-case.tsx/ts
- Evitar comentários desnecessários
- Priorizar código autoexplicativo

### Estrutura de Componentes
```tsx
// 1. Imports externos
import { useState } from "react";

// 2. Imports de libs
import { useQuery } from "@tanstack/react-query";

// 3. Imports locais
import { Button } from "@/components/ui/button";

// 4. Types
interface Props { ... }

// 5. Componente
export function Component({ ... }: Props) {
  // Hooks
  // Event handlers
  // Render
}
```

### Server Functions
- Validação com Zod sempre
- Handlers separados em `src/services`
- Error handling consistente
- Type-safe com Drizzle

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Autores

**AtPlus Digital**

---

⚡ Desenvolvido com React, TypeScript e ❤️