import { Link } from '@/models/links';
import { Url } from '@/models/urls';

export function setupAssociations() {
    Link.belongsTo(Url, { foreignKey: 'idurls', onDelete: "CASCADE", as: "urls" });
    Url.hasMany(Link, { foreignKey: 'idurls', onDelete: "CASCADE", as: 'links' });
}
