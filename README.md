1. Clone project
2. Setup env for supabase and openai (see example at .env.example)
3. Accessing supabase now using this code below : 

```
const xCoinUrl = useConfig()((state) => state.config.x_coin_url);
const buyUrl = useConfig()((state) => state.config.buy_url);
```