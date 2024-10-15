#WeAI developer platform

## Developer quickstart

Set up your environment and make your first API request in minutes.
=== "curl"
    ```
    curl https://weai.productscience.ai/v1/chat/completions
    -H "Content-Type: application/json"
    -H "Authorization: Bearer $WEAI_API_KEY"
    -d '{
            "model": "llama3.1-8B",
            "messages": [
                {"role": "user", "content": "write a haiku about ai"}
            ]
    }'
    ```

=== "node.js"
    ```
    import WeAI from "weai";
    const weai = new WeAI();
    const completion = await weai.chat.completions.create({
        model: "mistral-large-2407",
        messages: [
            {"role": "user", "content": "write a haiku about ai"}
        ]
    });

    ```

=== "python"
    ```
    from weai import WeAI
    client = WeAI()
    completion = client.chat.completions.create(
        model="mistral-large-2407",
        messages=[
            {"role": "user", "content": "write a haiku about ai"}
        ]
    )
    ```

## Meet the models

Here is a selection of open-source models, including LLaMA 3.1 in its various configurations—8B, 70B, and 405B—alongside Mistral AI. These models provide diverse capabilities suitable for a wide range of applications, from lightweight tasks to complex analyses.

### [llama3.1 8B](/Getstarted/Models/Models/#llama31-8b_2)
Light-weight, ultra-fast model you can run anywhere.

- Text input and output
- 8 billion parameters
- Optimized for quick tasks and minimal resource consumption

### [llama3.1 70B](/Getstarted/Models/Models/#llama31-70b_1)
Highly performant, cost effective model that enables diverse use cases.

- Text input and output
- 70 billion parameters
- Strikes a balance between performance and efficiency for a variety of applications

### [Mistral Large 2](/Getstarted/Models/Models/#mistral-large-2)
Top-tier reasoning for high-complexity tasks, for your most sophisticated needs.

- Multi-lingual (incl. European languages, Chinese, Japanese, Korean, Hindi, Arabic)
- Large context window of 128K tokens
- Native function calling capacities and JSON outputs
- High coding proficiency (80+ coding languages)

### [Mistral Small 24.09](/Getstarted/Models/Models/#mistral-small-2409)
Enterprise-grade small model.

- The most powerful model in its size
- Available under the Mistral Research License
- 128k token context window
- Cost-efficient and fast model for a wide array of use cases such as translation, summarization, and sentiment analysis
