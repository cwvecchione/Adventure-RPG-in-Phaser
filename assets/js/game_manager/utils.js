function getTiledProperty(obj, property_name) {
    for (var property_index = 0; property_index < obj.properties.length; property_index += 1) {
        var property = obj.properties[property_index];
        if (property.name == property_name) {
            return property.value;
        }
    }
}

const SpawnerType = {
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
};

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}