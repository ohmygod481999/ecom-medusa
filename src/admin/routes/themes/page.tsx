import {RouteConfig} from '@medusajs/admin';
import {Table} from '@medusajs/ui';
import {useAdminThemeList} from '../../data/themes/use-admin-themes';
import { Link } from "react-router-dom"

const ThemePage = () => {
  const {theme_list} = useAdminThemeList();
  return (
    <div>
      {theme_list && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell>Id</Table.Cell>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell>Url</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {theme_list.themes.map(theme => (
              <Table.Row>
                <Table.Cell>{theme.id}</Table.Cell>
                <Table.Cell>{theme.title}</Table.Cell>
                <Table.Cell>{theme.url}</Table.Cell>
                <Table.Cell>{theme.description}</Table.Cell>
                <Table.Cell>
                  <button className="text-violet-60 inter-small-semibold">
                    <Link to={`/a/themes/code-edit/${theme.id}`}>
                      edit
                    </Link>
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: 'Themes',
  },
};

export default ThemePage;
