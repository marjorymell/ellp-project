# ELLP - Ensino Lúdico de Lógica de Programação

## 📋 Sobre o Projeto

### Equipe
**Desenvolvido por:** Grupo 2

### Objetivo do Sistema
O sistema é uma plataforma web desenvolvida para facilitar a divulgação e gerenciamento de oficinas de programação do [projeto ELLP](https://www.instagram.com/grupoellp/) da UTFPR. O sistema permite que voluntários criem e divulguem oficinas, enquanto administradores gerenciam usuários e aprovam solicitações de voluntários.

### Funcionalidades Desenvolvidas

#### 🔐 Sistema de Autenticação
- Login e registro de usuários
- Sistema de aprovação para voluntários
- Controle de acesso baseado em roles (admin/voluntário)

#### 👥 Gerenciamento de Usuários
- Cadastro de administradores e voluntários
- Sistema de aprovação de contas de voluntários
- Perfis de usuário com informações acadêmicas
- Página de contato com equipe visível

#### 📚 Gerenciamento de Oficinas
- Criação de oficinas com informações detalhadas
- Upload de imagens para divulgação
- Controle de datas de inscrição e realização
- Links diretos para inscrição

#### 🖼️ Upload de Imagens
- Integração com Cloudinary para armazenamento
- Suporte a múltiplos formatos (PNG, JPG, WebP)
- Validação de tamanho e tipo de arquivo

## 🛠️ Tecnologias Utilizadas

### Ferramentas de Desenvolvimento
- **Node.js** v18+ - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recomendado) - [Download](https://code.visualstudio.com/)

### Framework e Bibliotecas Principais
- **Next.js** v15.3.3 - Framework React - [Documentação](https://nextjs.org/)
- **React** v19.0.0 - Biblioteca JavaScript - [Documentação](https://react.dev/)
- **TypeScript** v5 - Superset do JavaScript - [Documentação](https://www.typescriptlang.org/)
- **Tailwind CSS** v4 - Framework CSS - [Documentação](https://tailwindcss.com/)

### Banco de Dados e Autenticação
- **Firebase** v11.10.0 - [Console](https://console.firebase.google.com/)
  - Firestore Database (NoSQL)
  - Firebase Authentication
  - Firebase Hosting

### Serviços Externos
- **Cloudinary** - Upload e gerenciamento de imagens - [Site](https://cloudinary.com/)

### Bibliotecas Complementares
- **@radix-ui/react-\*** - Componentes acessíveis
- **lucide-react** v0.516.0 - Ícones
- **class-variance-authority** v0.7.1 - Utilitário para classes CSS
- **clsx** v2.1.1 - Utilitário para classes condicionais
- **tailwind-merge** v3.3.1 - Merge de classes Tailwind

## 🚀 Configuração e Instalação

### 1. Pré-requisitos
Certifique-se de ter instalado:
- Node.js v18 ou superior
- npm ou yarn
- Git

### 2. Clonando o Repositório
```bash
git clone https://github.com/marjorymell/ellp-project/
cd ellp-project
```

### 3. Instalação das Dependências
```bash
npm install
# ou
yarn install
```

### 4. Configuração do Firebase

#### 4.1. Criar Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Siga os passos de configuração

#### 4.2. Configurar Authentication
1. No console do Firebase, vá em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite "Email/senha"

#### 4.3. Configurar Firestore Database
1. No console do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (temporariamente)
4. Selecione uma localização

#### 4.4. Obter Credenciais
1. No console do Firebase, vá em "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique em "Adicionar app" e escolha "Web"
4. Registre o app e copie as credenciais

### 5. Configuração do Cloudinary

#### 5.1. Criar Conta
1. Acesse [Cloudinary](https://cloudinary.com/)
2. Crie uma conta gratuita

#### 5.2. Configurar Upload Preset
1. No dashboard do Cloudinary, vá em "Settings" > "Upload"
2. Role até "Upload presets"
3. Clique em "Add upload preset"
4. Configure:
   - Upload preset name: `ellp-uploads`
   - Signing Mode: `Unsigned`
   - Folder: `ellp-project` (opcional)
5. Salve as configurações

#### 5.3. Obter Credenciais
No dashboard do Cloudinary, copie:
- Cloud name
- API Key
- API Secret

### 6. Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ellp-uploads
```

### 7. Executando o Projeto

#### Modo Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

#### Build para Produção
```bash
npm run build
npm run start
# ou
yarn build
yarn start
```

## 🧪 Testando o Sistema

### 1. Configuração Inicial

#### 1.1. Criar Primeiro Administrador
1. Acesse [http://localhost:3000/setup-admin](http://localhost:3000/setup-admin)
2. Preencha os dados do administrador (exemplo):
   - **Nome:** Administrador ELLP
   - **Email:** admin@ellp.com
   - **Senha:** admin123 (ou sua preferência)
   - **Curso:** Administração do Sistema
3. Clique em "Criar Administrador"

### 2. Contas de Acesso Padrão

#### Administrador
- **Email:** admin@ellp.com
- **Senha:** admin123
- **Funcionalidades:** Acesso completo ao sistema

### 3. Roteiro de Testes

#### 3.1. Teste de Autenticação
1. **Login como Administrador:**
   - Acesse [http://localhost:3000/login](http://localhost:3000/login)
   - Use as credenciais do administrador
   - Verifique se foi redirecionado para a página inicial

2. **Registro de Voluntário:**
   - Acesse [http://localhost:3000/register](http://localhost:3000/register)
   - Preencha todos os campos obrigatórios
   - Observe que a conta fica "pendente" de aprovação

#### 3.2. Teste do Sistema de Aprovação
1. **Como Administrador:**
   - Acesse [http://localhost:3000/admin](http://localhost:3000/admin)
   - Clique em "Solicitações" ou "Revisar Solicitações"
   - Aprove ou rejeite contas de voluntários

2. **Como Voluntário Aprovado:**
   - Faça login com a conta aprovada
   - Verifique acesso às funcionalidades de voluntário

#### 3.3. Teste de Gerenciamento de Oficinas
1. **Criar Oficina:**
   - Como usuário logado, clique em "Nova Oficina"
   - Preencha todos os campos obrigatórios
   - Faça upload de uma imagem
   - Salve a oficina

2. **Visualizar Oficinas:**
   - Acesse a página inicial
   - Verifique se a oficina aparece na listagem
   - Teste o link de inscrição

#### 3.4. Teste de Upload de Imagens
1. **Upload via Cloudinary:**
   - Ao criar/editar uma oficina
   - Clique em "Selecionar Imagem"
   - Escolha uma imagem (PNG, JPG, WebP até 5MB)
   - Verifique se o preview aparece corretamente

#### 3.5. Teste da Página de Contato
1. **Configurar Visibilidade:**
   - Como administrador, edite um usuário
   - Marque "Exibir na página de contato"
   - Salve as alterações

2. **Verificar Página:**
   - Acesse [http://localhost:3000/contato](http://localhost:3000/contato)
   - Verifique se o usuário aparece na listagem

### 4. Funcionalidades por Tipo de Usuário

####  Visitante (Não Logado)
- ✅ Visualizar oficinas na página inicial
- ✅ Acessar página de contato
- ✅ Registrar-se como voluntário
- ✅ Fazer login

####  Voluntário
- ✅ Todas as funcionalidades de visitante
- ✅ Criar novas oficinas
- ✅ Editar suas próprias oficinas
- ✅ Excluir suas próprias oficinas
- ✅ Acessar área do voluntário

####  Administrador
- ✅ Todas as funcionalidades de voluntário
- ✅ Aprovar/rejeitar solicitações de voluntários
- ✅ Gerenciar todos os usuários
- ✅ Criar usuários diretamente
- ✅ Editar/excluir qualquer oficina
- ✅ Acessar painel administrativo

## 🔧 Solução de Problemas

### Problemas Comuns

#### Firebase não configurado
- **Erro:** "Firebase não configurado"
- **Solução:** Verifique se todas as variáveis de ambiente do Firebase estão corretas no `.env.local`

#### Upload de imagem falha
- **Erro:** "Erro no upload"
- **Solução:** Verifique as credenciais do Cloudinary e se o upload preset está configurado como "Unsigned"

#### Conta pendente de aprovação
- **Erro:** "Sua conta ainda está pendente"
- **Solução:** Um administrador precisa aprovar a conta em `/admin/volunteer-requests`

#### Erro de permissão no Firestore
- **Erro:** "Permission denied"
- **Solução:** Verifique se as regras de segurança do Firestore estão configuradas corretamente

## 📁 Estrutura do Projeto

```
ellp-project/
├── src/
│   ├── app/                    # Páginas do Next.js (App Router)
│   │   ├── admin/             # Páginas administrativas
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registro
│   │   ├── workshops/         # Páginas de oficinas
│   │   └── ...
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes de interface
│   │   └── ...
│   ├── contexts/             # Contextos React
│   ├── lib/                  # Utilitários e configurações
│   └── ...
├── scripts/                  # Scripts de configuração
├── public/                   # Arquivos estáticos
├── .env.local               # Variáveis de ambiente (criar)
├── package.json             # Dependências do projeto
└── README.md               # Este arquivo
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção "Solução de Problemas"
2. Consulte a documentação das tecnologias utilizadas
3. Entre em contato com a equipe de desenvolvimento
