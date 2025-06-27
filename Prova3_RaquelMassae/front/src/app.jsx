import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reservas';

function App() {
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({ 
    nomeCliente: '', 
    numeroMesa: '', 
    dataHora: '', 
    status: 'reservado', 
    contato: '' 
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReservas = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setReservas(res.data);
    } catch (error) {
      console.error('Erro ao buscar reservas', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ nomeCliente: '', numeroMesa: '', dataHora: '', status: 'reservado', contato: '' });
      setEditId(null);
      await fetchReservas();
    } catch (error) {
      console.error('Erro ao salvar reserva', error);
    }
  };

  const handleEdit = (reserva) => {
    setForm({
      nomeCliente: reserva.nomeCliente,
      numeroMesa: reserva.numeroMesa,
      dataHora: reserva.dataHora.slice(0, 16),
      status: reserva.status,
      contato: reserva.contato
    });
    setEditId(reserva._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchReservas();
      } catch (error) {
        console.error('Erro ao excluir reserva', error);
      }
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const formatStatus = (status) => {
    return status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return (
    <div className="container">
      <h1>
        <i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i>
        Sistema de Reservas
      </h1>
      
      <form onSubmit={handleSubmit} className="form">
        <input 
          name="nomeCliente" 
          placeholder="Nome do Cliente" 
          value={form.nomeCliente} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="numeroMesa" 
          type="number" 
          placeholder="Número da Mesa" 
          value={form.numeroMesa} 
          onChange={handleChange} 
          required 
          min="1"
        />
        <input 
          name="dataHora" 
          type="datetime-local" 
          value={form.dataHora} 
          onChange={handleChange} 
          required 
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="reservado">Reservado</option>
          <option value="ocupado">Ocupado</option>
          <option value="disponível">Disponível</option>
        </select>
        <input 
          name="contato" 
          placeholder="Contato (Telefone)" 
          value={form.contato} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">
          {editId ? (
            <>
              <i className="fas fa-sync-alt" style={{ marginRight: '8px' }}></i>
              Atualizar Reserva
            </>
          ) : (
            <>
              <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i>
              Criar Reserva
            </>
          )}
        </button>
      </form>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p>Carregando reservas...</p>
        </div>
      ) : (
        <ul className="lista">
          {reservas.map((res) => (
            <li key={res._id}>
              <div>
                <strong>{res.nomeCliente}</strong>
                <div style={{ marginTop: '5px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  <span><i className="fas fa-utensils" style={{ marginRight: '5px' }}></i>Mesa {res.numeroMesa}</span>
                  <span style={{ margin: '0 10px' }}>|</span>
                  <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i>{new Date(res.dataHora).toLocaleString()}</span>
                  <span style={{ margin: '0 10px' }}>|</span>
                  <span className={`status-${formatStatus(res.status)}`}>
                    <i className="fas fa-circle" style={{ fontSize: '0.6rem', verticalAlign: 'middle', marginRight: '5px' }}></i>
                    {res.status}
                  </span>
                </div>
                <div style={{ marginTop: '5px', fontSize: '0.9rem' }}>
                  <i className="fas fa-phone" style={{ marginRight: '5px' }}></i>{res.contato}
                </div>
              </div>
              <div>
                <button onClick={() => handleEdit(res)}>
                  <i className="fas fa-edit" style={{ marginRight: '5px' }}></i>Editar
                </button>
                <button onClick={() => handleDelete(res._id)}>
                  <i className="fas fa-trash-alt" style={{ marginRight: '5px' }}></i>Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;