function ReportsHeader() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
				<p className="text-muted-foreground">
					Dados detalhados e exportação de relatórios
				</p>
			</div>
		</div>
	);
}

export { ReportsHeader };
