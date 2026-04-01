# Implementação: Upload de Imagens - Frontend Admin GemCapital

## ✅ Mudanças Realizadas

### Arquivo: `src/Components/Platform/BlogGemCapital/Post/PostForm.js`

#### 1. Importações Adicionadas
```javascript
import gemCapitalBlogServices from "../../../../dbServices/gemCapitalBlogServices";
```

#### 2. Novos Estados
```javascript
const [isUploadingImage, setIsUploadingImage] = useState(false);
const [imageError, setImageError] = useState(null);
```

#### 3. Nova Função: `handleImageUpload()`
```javascript
const handleImageUpload = async (e) => {
  // 1. Valida tipo de arquivo (JPEG, PNG, GIF, WebP)
  // 2. Valida tamanho (máx 5MB)
  // 3. Faz POST para /blog-gemcapital/posts/upload-image
  // 4. Recebe URL do Firebase
  // 5. Preenche campo featuredImage
  // 6. Mostra erro se algo der errado
}
```

#### 4. Interface do Upload

**Antes:**
- Input de texto: `<input type="text" placeholder="https://..." />`

**Depois:**
- Input de arquivo: `<input type="file" accept="image/*" />`
- Área com drag & drop visual
- Borda tracejada e ícone visual
- Estados: uploading, error, success

#### 5. Validações Frontend

✅ Tipos permitidos: JPEG, PNG, GIF, WebP
✅ Tamanho máximo: 5MB
✅ Validação antes de enviar

#### 6. Feedback Visual

**Status de Upload:**
```
🔄 Enviando imagem...
```

**Sucesso:**
- Preview da imagem
- URL mostrada abaixo do preview
- Campo preenchido com a URL

**Erro:**
- Mensagem de erro vermelha
- Pode tentar novamente

---

## 🔄 Fluxo Completo

```
1. Usuário clica no input de arquivo
   ↓
2. Seleciona imagem (JPEG, PNG, GIF, WebP)
   ↓
3. Frontend valida:
   ├─ Tipo de arquivo ✓
   └─ Tamanho < 5MB ✓
   ↓
4. Frontend mostra "Enviando imagem..."
   ↓
5. POST /api/blog-gemcapital/posts/upload-image
   └─ FormData { file }
   ↓
6. Backend faz upload para Firebase
   └─ Retorna: { "url": "https://firebasestorage..." }
   ↓
7. Frontend recebe URL
   ├─ Preenche campo: formData.featuredImage = URL
   ├─ Mostra preview da imagem
   └─ Mostra URL abaixo do preview
   ↓
8. Usuário preenche resto do formulário
   ├─ Título
   ├─ Resumo
   ├─ Conteúdo HTML
   ├─ Categorias
   └─ Etc
   ↓
9. Usuário clica "Criar Post" / "Atualizar Post"
   ↓
10. Frontend envia:
    POST /api/blog-gemcapital/posts
    {
      title: "...",
      excerpt: "...",
      content: "...",
      featuredImage: "https://firebasestorage...", ← URL da imagem
      categoryIds: [1, 2],
      ...
    }
    ↓
11. Backend valida URL (rejeita base64)
    ↓
12. Backend cria post com a URL
    ↓
13. Sucesso! Post criado com imagem
```

---

## 🧪 Teste Local

### Pré-requisitos
1. Backend rodando em `http://localhost:5000`
2. Firebase Storage configurado
3. Frontend rodando em `http://localhost:3000`

### Passos

1. **Navegar para criar novo post**
   ```
   http://localhost:3000/platform/blog-gemcapital/posts/novo-post
   ```

2. **Selecionar imagem**
   - Clique no input de arquivo
   - Selecione uma imagem JPEG, PNG, GIF ou WebP
   - Máximo 5MB

3. **Validar upload**
   - Deve mostrar "Enviando imagem..."
   - Deve mostrar preview da imagem
   - Deve preencher campo com URL do Firebase

4. **Criar post**
   - Preencha: Título, Resumo, Conteúdo
   - Selecione uma categoria
   - Clique em "Criar Post"
   - Deve criar com sucesso

5. **Verificar post criado**
   - URL da imagem deve estar preenchida
   - Preview deve aparecer na listagem de posts

---

## 🛡️ Tratamento de Erros

### Erro 1: Arquivo muito grande
```
❌ Arquivo muito grande. Máximo: 5MB
```
**Solução:** Redimensione a imagem

### Erro 2: Tipo de arquivo inválido
```
❌ Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP
```
**Solução:** Use um dos tipos permitidos

### Erro 3: Erro no upload (backend)
```
❌ Erro ao fazer upload da imagem: Mensagem do backend
```
**Solução:** Verifique logs do backend

### Erro 4: Erro ao carregar preview
```
❌ Erro ao carregar preview da imagem
```
**Solução:** A URL retornou 404 (problema no Firebase)

---

## 📝 Código-chave

### Input de Arquivo
```javascript
<input
  type="file"
  accept="image/jpeg,image/png,image/gif,image/webp"
  onChange={handleImageUpload}
  disabled={isLoading || isUploadingImage}
/>
```

### Upload Assíncrono
```javascript
const response = await fetch(
  `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/blog-gemcapital/posts/upload-image`,
  {
    method: "POST",
    body: formData, // FormData com o arquivo
  }
);

const data = await response.json(); // { url: "https://..." }
```

### Preencher Campo
```javascript
setFormData((prev) => ({
  ...prev,
  featuredImage: data.url, // URL do Firebase
}));
```

---

## 🎨 Estilos

- Borda tracejada marrom/ouro (#C9A96E)
- Fundo claro (#f9f8f6)
- Upload em progresso: azul claro
- Erro: vermelho
- Preview abaixo do arquivo

---

## 📋 Checklist de Implementação

- ✅ Input de arquivo adicionado
- ✅ Validação de tipo/tamanho
- ✅ Função handleImageUpload()
- ✅ Upload assíncrono com FormData
- ✅ Feedback visual (loading, erro, sucesso)
- ✅ Preview da imagem
- ✅ URL exibida para referência
- ✅ Tratamento de erros
- ✅ Logging para debug

---

## 🔗 Endpoints Utilizados

**Upload (novo):**
```
POST /api/blog-gemcapital/posts/upload-image
Content-Type: multipart/form-data

Request: FormData { file }
Response: { "url": "https://firebasestorage..." }
```

**Criar Post (existente, mas agora com URL):**
```
POST /api/blog-gemcapital/posts
Content-Type: application/json

Request: { title, excerpt, content, featuredImage: URL, ... }
Response: { id, title, featuredImage: URL, ... }
```

---

## 🚀 Próximos Passos

1. ✅ Testar upload de imagem
2. ✅ Testar criação de post com URL
3. ✅ Testar rendering de email (depois de ajustar email service)
4. ⏳ Migrar posts antigos com base64 (se necessário)

