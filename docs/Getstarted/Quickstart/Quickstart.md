# Developer quickstart

The Name_Placeholder provides a simple interface to state-of-the-art AI models for natural language processing, image generation, 
semantic search, and speech recognition. Follow this guide to learn how to generate human-like responses to natural language prompts,
create vector embeddings for semantic search, and generate images from textual descriptions.

## Create and export an API key
Create an API key in the dashboard here, which you’ll use to securely access the API. Store the key in a safe location, like a `.zshrc` file or another text file on your computer. Once you’ve generated an API key, export it as an environment variable in your terminal.

=== "macOS / Linux"
    ```macOS title="Export an envrionment variable on *nix systems"
    export OPENAI_API_KEY="your_api_key_here"
    ```

=== "Windows"
    ```Windows title="Export an envrionment variable in PowerShell"
    setx OPENAI_API_KEY "your_api_key_here"
    ```

## Make your first API request
With your Name_Placeholder API key exported as an environment variable, you're ready to make your first API request. You can either use the REST API directly with the HTTP client of your choice, or use one of our official SDKs as shown below.

=== "macOS / Linux"
    ```macOS title="Export an envrionment variable on *nix systems"
    export OPENAI_API_KEY="your_api_key_here"
    ```

=== "Windows"
    ```Windows title="Export an envrionment variable in PowerShell"
    setx OPENAI_API_KEY "your_api_key_here"
    ```

Execute the code with node example.mjs (or the equivalent command for Deno or Bun). In a few moments, you should see the output of your API 
request!

## Next steps

Now that you've made your first Name_Placeholder request, you can explore the following resources:

### [Chat Completions](/Endpoints/Chatcompletion/Overview/)
Learn more about generating text responses to natural language prompts

### [soon] Image Generation
Generate images using our DALL·E model

### [soon] Embeddings
Create vector representations of text, used for similarity search

### [soon] Text-to-speech
Generate human-like voice recordings with our text-to-speech model

### [soon] Speech-to-text
Create transcriptions of voice recordings with our Whisper model

### [soon] Moderation
Analyze and filter user-created content with our moderation model

### [soon] Fine-tuning
Fine-tune our models with your own data

### [soon] Batch
Batch requests for async jobs

### [soon] Full API Reference
View the full REST API reference for Name_Placeholder