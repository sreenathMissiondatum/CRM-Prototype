import React, { useState, useCallback } from 'react';
import { MappingTemplatesStore } from '../../../data/mockMappingTemplates';
import TemplateList from './FinancialMappingTemplates/TemplateList';
import TemplateMetaForm from './FinancialMappingTemplates/TemplateMetaForm';
import TemplateModeWorkbench from './FinancialMappingTemplates/TemplateModeWorkbench';

/**
 * Top-level orchestrator for Financial Mapping Templates admin section.
 * Manages view routing between: list → create-meta → workbench → edit
 */
const FinancialMappingTemplates = ({ userRole }) => {
    // Views: 'list' | 'create-meta' | 'workbench' | 'edit'
    const [view, setView] = useState('list');
    const [draftMeta, setDraftMeta] = useState(null);   // Template metadata from Step 1
    const [editTarget, setEditTarget] = useState(null); // Template being edited
    const [templates, setTemplates] = useState(() => MappingTemplatesStore.getAll());

    const refreshTemplates = useCallback(() => {
        setTemplates(MappingTemplatesStore.getAll());
    }, []);

    // ── CREATE FLOW ──────────────────────────────────────────────────────────
    const handleStartCreate = () => {
        setDraftMeta(null);
        setEditTarget(null);
        setView('create-meta');
    };

    const handleMetaSubmit = (meta) => {
        setDraftMeta(meta);
        setView('workbench');
    };

    const handleWorkbenchSave = (mappings) => {
        MappingTemplatesStore.create({ ...draftMeta, mappings });
        refreshTemplates();
        setView('list');
    };

    // ── EDIT FLOW ────────────────────────────────────────────────────────────
    const handleEdit = (template) => {
        setEditTarget(template);
        setDraftMeta({
            name: template.name,
            sourceType: template.sourceType,
            industry: template.industry,
            description: template.description,
        });
        setView('edit');
    };

    const handleEditSave = (mappings) => {
        MappingTemplatesStore.edit({ id: editTarget.id, mappings });
        refreshTemplates();
        setView('list');
    };

    // ── CLONE ────────────────────────────────────────────────────────────────
    const handleClone = (template, newName) => {
        MappingTemplatesStore.clone({ id: template.id, newName });
        refreshTemplates();
    };

    // ── STATUS / DELETE ──────────────────────────────────────────────────────
    const handleSetStatus = (template, status) => {
        MappingTemplatesStore.setStatus({ id: template.id, status });
        refreshTemplates();
    };

    const handleDelete = (template) => {
        MappingTemplatesStore.delete({ id: template.id });
        refreshTemplates();
    };

    // ── RENDER ───────────────────────────────────────────────────────────────
    if (view === 'create-meta') {
        return (
            <TemplateMetaForm
                existingNames={templates.map(t => t.name)}
                onSubmit={handleMetaSubmit}
                onCancel={() => setView('list')}
            />
        );
    }

    if (view === 'workbench') {
        return (
            <TemplateModeWorkbench
                meta={draftMeta}
                initialMappings={[]}
                onSave={handleWorkbenchSave}
                onCancel={() => setView('create-meta')}
            />
        );
    }

    if (view === 'edit') {
        const latestVersion = editTarget.versions[editTarget.versions.length - 1];
        return (
            <TemplateModeWorkbench
                meta={draftMeta}
                initialMappings={latestVersion.mappings}
                editMode
                templateId={editTarget.id}
                currentVersion={latestVersion.version}
                onSave={handleEditSave}
                onCancel={() => setView('list')}
            />
        );
    }

    // Default: 'list'
    return (
        <TemplateList
            templates={templates}
            onCreateNew={handleStartCreate}
            onEdit={handleEdit}
            onClone={handleClone}
            onSetStatus={handleSetStatus}
            onDelete={handleDelete}
        />
    );
};

export default FinancialMappingTemplates;
