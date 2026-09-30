const state = {
  services: [],
  projects: [],
  blog: [],

  async init() {
    await this.loadAll();
  },

  async loadAll() {
    const types = ['services', 'projects', 'blog'];
    for (const type of types) {
      try {
        const response = await fetch(`data/${type}.json`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            this[type] = data;
            this.save(type);
            continue;
          }
        }
      } catch (e) {
        console.warn(`Could not fetch ${type}.json:`, e);
      }
      this[type] = this.load(type);
    }
  },

  load(type) {
    try {
      const raw = localStorage.getItem(`admin_${type}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(`Failed to load ${type} from storage:`, e);
    }
    return [];
  },

  save(type) {
    try {
      localStorage.setItem(`admin_${type}`, JSON.stringify(this[type]));
    } catch (e) {
      console.error(`Failed to save ${type}:`, e);
      throw e;
    }
  },

  getAll(type) {
    return this[type] || [];
  },

  getById(type, id) {
    return this[type].find(item => item.id == id);
  },

  add(type, item) {
    this[type].push(item);
    this.save(type);
    return item;
  },

  update(type, id, updates) {
    const index = this[type].findIndex(item => item.id == id);
    if (index === -1) return null;
    this[type][index] = { ...this[type][index], ...updates };
    this.save(type);
    return this[type][index];
  },

  remove(type, id) {
    const index = this[type].findIndex(item => item.id == id);
    if (index === -1) return false;
    this[type].splice(index, 1);
    this.save(type);
    return true;
  },

  importFromFile(type, json) {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        this[type] = data;
        this.save(type);
        return true;
      }
    } catch (e) {
      console.error(`Failed to import ${type}:`, e);
    }
    return false;
  },

  reset(type) {
    this[type] = [];
    this.save(type);
  }
};
