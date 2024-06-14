Prerequisites
1. Node.js (>= 14.x)
    npm or Yarn
2. Sanity.io account
3. Stripe account

Getting Started
1. Clone the Repository
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
2. Install Dependencies
    Using npm:
        npm install
    Using Yarn:
        yarn install
3. Set Up Environment Variables
Create a .env.local file in the root directory and add the following environment variables:

    NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
    NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
    SANITY_API_TOKEN=your_sanity_api_token
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    Replace the placeholder values with your actual Sanity.io and Stripe credentials.

4. Sanity.io Configuration
    Navigate to the sanity directory and initialize the Sanity project:

    cd sanity
    sanity init
    Follow the prompts to set up your Sanity project.

5. Start the Development Server
    Navigate back to the root directory and run the development server:

    Using npm:
        npm run dev
    Using Yarn:
        yarn dev

Open http://localhost:3000 in your browser to see the application in action.

