# Name_placeholder developer platform

## Developer quickstart

Set up your environment and make your first API request in minutes.
=== "curl"
    ```node title="place/holder"
    import Name_Placeholder from "Name_Placeholder";
    const Name_Placeholder = new Name_Placeholder();
    const completion = await Name_Placeholder.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
    });
    ```

=== "node.js"
    ```node title="place/holder"
    import Name_Placeholder from "Name_Placeholder";
    const Name_Placeholder = new Name_Placeholder();
    const completion = await Name_Placeholder.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
    });
    ```

=== "python"
    ```python title="place/holder"
    import Name_Placeholder from "Name_Placeholder";
    const Name_Placeholder = new Name_Placeholder();
    const completion = await Name_Placeholder.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
    });
    ```

## Meet the models

### [llama3.1 8B](/Getstarted/Models/Models/#llama31-8b_2)
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants.

### [llama3.1 70B](/Getstarted/Models/Models/#llama31-70b_1)
The upgraded versions of the 8B and 70B models are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities. This enables Meta’s latest models to support advanced use cases, such as long-form text summarization, multilingual conversational agents, and coding assistants.

### [llama3.1 405B](/Getstarted/Models/Models/#llama31-405b_1)

Llama 3.1 405B is the first openly available model that rivals the top AI models when it comes to state-of-the-art capabilities in general knowledge, steerability, math, tool use, and multilingual translation.