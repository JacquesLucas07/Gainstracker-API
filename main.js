const testFeature = () => {
    console.log("This is a test feature.");
    return true;
};

// Test de la fonction
if (require.main === module) {
    const result = testFeature();
    console.log('Résultat du test:', result);
}

module.exports = { testFeature };
