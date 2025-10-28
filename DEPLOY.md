# Froppo Gestionale - Deploy Configuration

## Backend (.NET API)
- **Platform**: Railway
- **URL**: https://froppo-api-production.up.railway.app
- **Port**: 8080 (Railway auto-configura)

## Frontend (React)
- **Platform**: Vercel
- **URL**: https://froppo-gestionale.vercel.app
- **Build Command**: npm run build
- **Output Directory**: build

## Environment Variables

### Backend (Railway)
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
JWT__SECRET=MySuperSecretKeyThatIsAtLeast32CharactersLong!
JWT__ISSUER=Froppo
JWT__AUDIENCE=FroppoUsers
```

### Frontend (Vercel)
```
NODE_ENV=production
REACT_APP_API_URL=https://froppo-api-production.up.railway.app
```

## Deploy Steps

1. **Push to GitHub**: Commit all changes
2. **Railway Deploy**: Connect GitHub repo to Railway
3. **Vercel Deploy**: Connect GitHub repo to Vercel
4. **Test**: Verify both services work together

## Features
- ✅ JWT Authentication
- ✅ File Upload/Download
- ✅ Excel Export with PDFs
- ✅ Glassmorphism UI
- ✅ Responsive Design
- ✅ Rate Limiting
- ✅ CORS Configuration
