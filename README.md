# Auctoa Chatbot Frontend

🌐 **Live:** [https://auctoa-chat-frontend.vercel.app](https://auctoa-chat-frontend.vercel.app)

Frontend für den AI-gestützten Immobilien-Chatbot von Auctoa. Entwickelt mit React + Vite + TailwindCSS.

## Setup

1. **Repository klonen**
   ```bash
   git clone https://github.com/SCAILE-it/auctoa-chatbot-frontend.git
   cd auctoa-chatbot-frontend

2. **Abhängigkeiten installieren**
    ```bash
    npm install
    .env-Datei anlegen im Root-Verzeichnis: 
    
    VITE_API_URL=https://n8n.scaile.it/webhook/c8298f2e-aa44-40ae-bc0e-3ce4dd93d1f2

3. **Lokalen Dev-Server starten**
    ```bash
    npm run dev

4. **Deployment**

    Wird aktuell über Vercel deployed. 
    Die .env-Variable **VITE_API_URL** muss dort ebenfalls hinterlegt werden.

    🌐 [https://auctoa-chat-frontend.vercel.app](https://auctoa-chat-frontend.vercel.app)

### Environment

Erstellen Sie eine `.env` im Projektroot mit:

```
VITE_API_URL=https://n8n.scaile.it/webhook/REPLACE_ME
```

Sie können sich an `.env.example` orientieren.
