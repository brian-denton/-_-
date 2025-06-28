# Ollama Setup Guide

This application now uses Ollama for AI content generation instead of Hugging Face. Follow these steps to set up Ollama locally.

## 1. Install Ollama

### Windows
1. Download Ollama from [https://ollama.ai](https://ollama.ai)
2. Run the installer
3. Ollama will start automatically and run on `http://localhost:11434`

### macOS
```bash
brew install ollama
ollama serve
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
```

## 2. Pull a Model

After installing Ollama, pull a model for text generation:

```bash
# Recommended models (choose one):
ollama pull llama3.2          # Fast, good quality
ollama pull llama3.2:1b       # Very fast, smaller model
ollama pull gemma2:2b         # Alternative small model
ollama pull qwen2.5:3b        # Another good option
```

## 3. Configure Environment Variables

Update your `.env.local` file:

```env
# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## 4. Test Ollama

You can test if Ollama is working:

```bash
# List installed models
ollama list

# Test generation
ollama run llama3.2 "Generate a 2-word title for a digital designer"
```

## 5. Model Recommendations

- **llama3.2** (3.2GB) - Best balance of speed and quality
- **llama3.2:1b** (1.3GB) - Fastest, good for quick generation
- **qwen2.5:3b** (1.9GB) - Good alternative with fast responses
- **gemma2:2b** (1.6GB) - Google's model, compact and efficient

## 6. Performance Tips

- Use smaller models (1b-3b parameters) for faster generation
- Ensure Ollama is running before starting the Next.js app
- Models are cached locally after first download
- Restart Ollama service if you encounter connection issues

## 7. Troubleshooting

**Connection Issues:**
- Verify Ollama is running: `ollama list`
- Check the service: `http://localhost:11434/api/tags`
- Restart: `ollama serve`

**Model Not Found:**
- Pull the model: `ollama pull llama3.2`
- Check available models: `ollama list`

**Slow Generation:**
- Use a smaller model like `llama3.2:1b`
- Ensure sufficient RAM (4GB+ recommended)

## 8. Alternative Models

If the default models don't work well, try:
- `phi3:mini` (2.3GB) - Microsoft's efficient model
- `codellama:7b` (3.8GB) - Better for technical content
- `mistral:7b` (4.1GB) - High quality, slower generation