# Developer quickstart

The WeAI API provides a simple interface to state-of-the-art AI models for natural language processing. Follow this guide to learn how to generate human-like responses to natural language prompts.

## Create and export an API key
Create an API key in the dashboard here, which you’ll use to securely access the API. Store the key in a safe location, like a `.zshrc` file or another text file on your computer. Once you’ve generated an API key, export it as an environment variable in your terminal.

=== "macOS / Linux"
    ```macOS title="Export an envrionment variable on *nix systems"
    export WEAI_API_KEY="your_api_key_here"
    ```

=== "Windows"
    ```Windows title="Export an envrionment variable in PowerShell"
    setx WEAI_API_KEY "your_api_key_here"
    ```

## Make your first API request
With your WeAI API key exported as an environment variable, you're ready to make your first API request. You can either use the REST API directly with the HTTP client of your choice, or use one of our official SDKs as shown below.

To use the WeAI API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the official WeAI SDK for TypeScript and JavaScript. Get started by installing the SDK using npm or your preferred package manager:

=== "JavaScript"
```JavaScript title="Install the WeAI SDK with npm"
npm install weai
```

With the WeAI SDK installed, create a file called example.mjs and copy one of the following examples into it:

=== "JavaScript"
```JavaScript title="Create a human-like response to a prompt"
import WeAI from "weai";
const weai = new WeAI();

const completion = await weai.chat.completions.create({
    model: "llama3.1.-8",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
});
    
console.log(completion.choices[0].message);
```
    
To use the WeAI API in Python, you can use the official WeAI SDK for Python. Get started by installing the SDK using pip:    

=== "Python"
```Python title="Install the WeAI SDK with pip"
pip install wenai
```

With the WeAI SDK installed, create a file called `example.py` and copy one of the following examples into it:

=== "Python"
```Python title="Create a human-like response to a prompt"
from weai import WeAI
client = WeAI()
completion = client.chat.completions.create(
model="llama3.1-8",
messages=[
{"role": "system", "content": "You are a helpful assistant."},
{
"role": "user",
"content": "Write a haiku about recursion in programming."
}
]
)
print(completion.choices[0].message)
```
    
On Unix-based systems, you can test out the WeAI REST API using curl. The following commands assume that you have exported the `WEAI_API_KEY` system environment variable as shown above.

"curl"
    ```curl title="Create a human-like response to a prompt"
    curl "https://weai.productscience.ai/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $WEAI_API_KEY" \
    -d '{
        "model": "llama3.1-8",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Write a haiku that explains the concept of recursion."
            }
        ]
    }'"
    ```

Execute the code with node example.mjs (or the equivalent command for Deno or Bun). In a few moments, you should see the output of your API request!

## Next steps

Now that you've made your first WeAI request, you can explore the following resources:

### [Chat Completions](/Endpoints/Chatcompletion/Overview/)
Learn more about generating text responses to natural language prompts

### [soon] Image Generation
Generate images

### [soon] Embeddings
Create vector representations of text, used for similarity search

### [soon] Text-to-speech
Generate human-like voice recordings with text-to-speech model

### [soon] Speech-to-text
Create transcriptions of voice recordings 

### [soon] Moderation
Analyze and filter user-created content

### [soon] Fine-tuning
Fine-tune LLMs with your own data

### [soon] Batch
Batch requests for async jobs

### [soon] Full API Reference
View the full REST API reference for WeAI
