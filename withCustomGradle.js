const { withAppBuildGradle } = require('@expo/config-plugins');

const withFirebaseDependencies = (config) => {
    return withAppBuildGradle(config, (config) => {
        const { modResults } = config;
        let { contents } = modResults;

        // Dependensi yang ingin ditambahkan
        const firebaseBom = 'implementation(platform("com.google.firebase:firebase-bom:34.0.0"))';
        const firebaseAuth = 'implementation("com.google.firebase:firebase-auth")';
        const playServicesAuth = 'implementation("com.google.android.gms:play-services-auth:21.3.0")';

        // Pastikan kita tidak menambahkan dependensi yang sama berulang kali
        if (contents.includes(firebaseBom)) {
        console.log('Firebase BoM dependency already exists. Skipping.');
        return config;
        }

        // Gabungkan semua dependensi menjadi satu blok untuk disisipkan
        const dependenciesToAdd = `
        // Import the BoM for the Firebase platform
        ${firebaseBom}

        // Add the dependency for the Firebase Authentication library
        // When using the BoM, you don't specify versions in Firebase library dependencies
        ${firebaseAuth}

        // Also add the dependency for the Google Play services library and specify its version
        ${playServicesAuth}
    `;

        // Cari blok 'dependencies {' dan sisipkan dependensi baru di dalamnya
        const searchString = /dependencies\s*\{/;
        const replaceString = `dependencies {\n${dependenciesToAdd}`;
        
        contents = contents.replace(searchString, replaceString);

        modResults.contents = contents;
        return config;
    });
};

module.exports = withFirebaseDependencies;