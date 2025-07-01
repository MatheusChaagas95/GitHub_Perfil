import { useEffect, useState } from "react";
import styles from './ReposList.module.css';

const ReposList = ( { nomeUsuario } ) => {

	const [repos, setRepos] = useState([]);
	const [estaCarregando, setEstaCarregando] = useState(true);
	const [deuErro, setDeuErro] = useState(false); // Inicializa como false

	useEffect(() => {
		setEstaCarregando(true);
		setDeuErro(false); // Reseta o estado de erro a cada nova busca
		fetch(`https://api.github.com/users/${nomeUsuario}/repos`)
		.then(res => {
			if (res.status === 404) {
				setDeuErro(true);
				return []; // Retorna um array vazio para evitar erros ao tentar mapear
			}
			return res.json();
		})
		.then(resJson => {
			setTimeout(() => {
				setEstaCarregando(false);
				setRepos(resJson);
			},  3000);
		})
		.catch(() => {
			setEstaCarregando(false);
			setDeuErro(true); // Captura outros erros de rede, etc.
		})
	}, [nomeUsuario]);

	return (
		<div className="container" >
			{estaCarregando ? (
				<h1>Carregando...</h1>
			) : deuErro ? (
				<h1>Erro ao digitar o nome do usuário.</h1>
			) : (
				<ul className={styles.list}>
					{repos.map(({ id, name, language, html_url }) => (
						<li className={styles.listItem} key={id}>
							<div className={styles.itemName} >
								<b>Nome: </b>
								{name}
							</div>
							<div className={styles.itemLanguage} >
								<b>Linguagem: </b>
								{language}
							</div>
							<a className={styles.itemLink} target="_blank" href={html_url}>Visitar no Github</a>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default ReposList;