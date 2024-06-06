
# Description
Saas-web is a user-friendly web application where you can list your items for trade, similar to a marketplace. Easily trade goods with others in your community or beyond.



## Run Locally

Clone the project

```bash
  git clone https://github.com/soubhratra/saas-web.git
```

Go to the project directory

```bash
  cd saas-web
```

Install dependencies

```bash
  npm install
```

```bash
  npx prisma generate
```
```bash
  npx prisma bp push
```

Start the server

```bash
  npm run dev 
```

  
## Env Reference
You have to put these things into .env file before runnig this into your 
localhost

| Env Name     | Key                    |
| :------- | :-------------------------------- |
| `DATABASE_URL` | #############  |
| `DIRECT_URL` | #############  |
| `PRODUCTION_URL` | localhost:3000  |
| `AUTH_SECRET` | #############  |
| `NEXTAUTH_URL_INTERNAL` | #############  |
| `NEXT_PUBLIC_BASE_URL` | #############  |
| `RESEND_API_KEY` | #############  |
| `STRIPE_SECRET_KEY` | #############  |
| `STRIPE_WEBHOOK_SECRET` | #############  |
| `STRIPE_PRICE_ID_STARTER` | #############  |
| `STRIPE_PRICE_ID_PRO` | #############  |
| `STRIPE_PRICE_ID_PREMIUM` | #############  |
| `PUSHER_APP_ID` | #############  |
| `NEXT_PUBLIC_PUSHER_KEY` | #############  |
| `PUSHER_SECRET=` | #############  |
| `SANITY_PROJECT_ID` | #############  |



  
### All links that we have used in our product
[Supabase for database](https://supabase.com/)

[Next Auth V5](https://authjs.dev/getting-started/migrating-to-v5)

[Stripe for payment](https://stripe.com/in)

[Pusher for realtime intrection](https://pusher.com/)

[Sanity for managing blog content](https://www.sanity.io/)



## Deployment

To deploy this project you need to make repo in github and push the code into that after that connect your vercel account with github import the repo put all the env and tap on deploy good to go..



  
