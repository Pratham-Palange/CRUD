import React, { useState, useEffect } from 'react';

const ItemList = ({ setSelectedItem, refreshItems }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/items');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchItems();
    }, [refreshItems]);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/items/${id}`, {
                method: 'DELETE',
            });
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="my-4">Items</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <button onClick={() => setSelectedItem(item)} className="btn btn-primary mr-2 ">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger ms-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemList;
