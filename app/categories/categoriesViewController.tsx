import { CategoriesView, type CategoriesViewProps } from "./CategoriesView";
import {
	openCreateModal,
	openDeleteConfirmation,
	openEditModal,
	type CategoriesState,
} from "./categoriesState";
import type { StateSetter } from "./categoriesScreenTypes";

export function renderCategoriesView(
	state: CategoriesState,
	setState: StateSetter,
	onUpdateDraftField: CategoriesViewProps["onUpdateDraftField"],
	onSubmitEdit: CategoriesViewProps["onSubmitEdit"],
	onConfirmDelete: CategoriesViewProps["onConfirmDelete"],
) {
	return (
		<CategoriesView
			state={state}
			onPreviousPage={() => {
				setState((current) => ({ ...current, page: state.page - 1 }));
			}}
			onNextPage={() => {
				setState((current) => ({ ...current, page: state.page + 1 }));
			}}
			onOpenCreate={() => {
				setState((current) => openCreateModal(current));
			}}
			onOpenEdit={(id) => {
				setState((current) => openEditModal(current, id));
			}}
			onOpenDelete={(id) => {
				setState((current) => openDeleteConfirmation(current, id));
			}}
			onUpdateDraftField={onUpdateDraftField}
			onSubmitEdit={onSubmitEdit}
			onCancelEdit={() => {
				setState((current) => ({ ...current, editDraft: null }));
			}}
			onConfirmDelete={onConfirmDelete}
			onCancelDelete={() => {
				setState((current) => ({ ...current, deleteCandidate: null }));
			}}
		/>
	);
}
