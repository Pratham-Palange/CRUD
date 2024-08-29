import React, { useState } from 'react';
import ItemList from './component/ItemList';
import ItemForm from './component/ItemForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [refreshItems, setRefreshItems] = useState(false);

    const handleRefreshItems = () => {
        setRefreshItems(!refreshItems);
    };

    return (
        <div className="container">
            <h1 className="my-4">CRUD Application</h1>
            <ItemForm selectedItem={selectedItem} setSelectedItem={setSelectedItem} refreshItems={handleRefreshItems} />
            <ItemList setSelectedItem={setSelectedItem} refreshItems={refreshItems} />
        </div>
    );
}

export default App;
