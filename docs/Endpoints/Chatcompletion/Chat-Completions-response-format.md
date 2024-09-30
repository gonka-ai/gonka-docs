# Chat Completions response format

An example Chat Completions API response looks as follows:

```bash
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
        "role": "assistant"
      },
      "logprobs": null
    }
  ],
  "created": 1677664795,
  "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
  "model": "llama3.1-8B",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 17,
    "prompt_tokens": 57,
    "total_tokens": 74
  }
}
```

The assistant's reply can be extracted with:

=== "curl"
    ```
    message = completion.choices[0].message.content
    ```

=== "python"
    ```
    message = completion.choices[0].message.content
    ```

=== "node.js"
    ```
    message = completion.choices[0].message.content
    ```

Every response will include a `finish_reason`. The possible values for `finish_reason` are:

- `stop`: API returned complete message, or a message terminated by one of the stop sequences provided via the stop parameter
- `length`: Incomplete model output due to `max_tokens` parameter or token limit
- `function_call`: The model decided to call a function
- `content_filter`: Omitted content due to a flag from our content filters
- `null`: API response still in progress or incomplete

Depending on input parameters, the model response may include different information.
