# Models
The WeAI API is powered by open-source models, including LLaMA 3.1 (8B, 70B) and Mistral AI. These models offer a range of capabilities to support various applications.

## Models overview

### llama3.1 8B
Light-weight, ultra-fast model you can run anywhere.

- Text input and output
- 8 billion parameters
- Optimized for quick tasks and minimal resource consumption
  
The Llama 3.1 8B model is a lightweight, multilingual auto-regressive language model optimized for diverse dialogue applications. With 8 billion parameters, it leverages advanced training techniques like supervised fine-tuning and reinforcement learning from human feedback to deliver high-quality responses. Ideal for assistant-like tasks, it supports multiple languages including English, Spanish, and German, making it versatile for various commercial and research use cases.

### llama3.1 70B
Highly performant, cost effective model that enables diverse use cases.

- Text input and output
- 70 billion parameters
- Strikes a balance between performance and efficiency for a variety of applications

The 70B variant of Llama 3.1 offers a significant increase in capacity, providing enhanced contextual understanding and generation capabilities. With 70 billion parameters, this model excels in complex dialogue scenarios and is well-suited for applications requiring deeper conversational engagement. Its multilingual support ensures it can cater to a global audience, making it a robust choice for businesses and researchers aiming to develop sophisticated language-based solutions.

### Mistral Large 2
Top-tier reasoning for high-complexity tasks, for your most sophisticated needs.

- Multi-lingual (incl. European languages, Chinese, Japanese, Korean, Hindi, Arabic)
- Large context window of 128K tokens
- Native function calling capacities and JSON outputs
- High coding proficiency (80+ coding languages)

The Mistral Large 2 model is engineered for high-complexity tasks, delivering top-tier reasoning capabilities. This multilingual model supports a wide range of languages, including European languages, Chinese, Japanese, Korean, Hindi, and Arabic. With an impressive context window of 128K tokens, it excels in handling extensive inputs. Additionally, it features native function calling and JSON output capabilities, making it highly effective for advanced coding tasks across 80+ programming languages.

### Mistral Small 24.09
Enterprise-grade small model.

- The most powerful model in its size
- Available under the Mistral Research License
- 128k token context window
- Cost-efficient and fast model for a wide array of use cases such as translation, summarization, and sentiment analysis

The Mistral Small 24.09 model stands out as an enterprise-grade solution in the small model category, renowned for its power and efficiency. Available under the Mistral Research License, it offers a 128K token context window, allowing for comprehensive processing of input data. This cost-effective and fast model is well-suited for a variety of applications, including translation, summarization, and sentiment analysis, making it an excellent choice for diverse use cases.

### Continuous model upgrades
`Llama 3.1-8B`, `Llama 3.1-70B`, `Mistral Large 2` and `Mistral Small 24.09` point to their respective latest model version. You can verify this by looking at the response object after sending a request. The response will include the specific model version used (e.g. `mistral-large-2407`).
