<script lang="ts">
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import supabase from "$lib/db";
    import { nav } from "$lib/stores/nav";
    import "../app.css";

    let userId: any;

    // Listening for authentication changes.
    supabase.auth.onAuthStateChange((event, sesh) => {
        console.log("Auth state changed: ", event, sesh);
        userId = sesh?.user?.id; // Assuming session object has a user object which has an id.
    });

    // On component initialization.
    $: {
        console.log("Component Initialized.");
        userId = supabase.auth.session()?.user?.id; // Check if user exists in the session.
        console.log("Session Retrieved:", userId);

        const currentPath = $page.url.pathname;
        const allowedPaths = ['/confirm', '/register'];  // Allowed paths without authentication
        if (browser && !userId && !allowedPaths.includes(currentPath)) {
            console.log("Redirecting to login due to no active session and not being on allowed paths.");
            goto($nav.login);
        }
    }
</script>

<slot />
