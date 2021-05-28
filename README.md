<!-- wp:heading -->
<h2>Overview</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This control provides a nice UX to work with custom Microsoft Dataverse association (aka joint or many-to-many) tables on model-driven Power Apps (D365) forms.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="/images/Association-Table-Control-Form-Example.gif" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>There are several advantages to using custom Microsoft Dataverse tables to implement many-to-many relationships in Microsoft Dataverse. For more information and examples please read <a href="https://crm.vet/power-apps-pcf-association-table-control-for-joint-many-to-many-tables/">this post.</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Data structure model for this control:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":550,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="/images/Association-Table-Control-ERD.svg" alt="" class="wp-image-550"/></figure>
<!-- /wp:image -->

<!-- wp:heading -->
<h2>Installation</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>You can either take source code and embed it to your DevOps process (if planning to modify the control) or install a ready-to-use solution. You can find it in <a href="https://github.com/crmvet/AssociationTableControl/releases">Releases Folder.</a></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Configuration</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>On the string (Single Text or Multiline Text) you can go to the Field Properties &gt; Controls &gt; Add Control. </p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":615,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="/images/Association-Table-Control-Configuration-Form-Example.png" alt="" class="wp-image-615"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":3} -->
<h3>Configuration Parameters Description</h3>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table"><table><tbody><tr><td><strong>Parameter</strong></td><td>Description</td><td>Example</td></tr><tr><td><strong><strong><strong>Selector Table</strong></strong></strong></td><td>Name for the Selector Table to show records to choose from in UI</td><td>crmvet_table2</td></tr><tr><td><strong>Selector Label</strong></td><td>Logical Name for the Selector Table field to be used as a Label in UI for selector items</td><td>crmvet_uilabel</td></tr><tr><td><strong>Association Table</strong></td><td>Name for the Association Table (aka N:N Table) where joint/association records are stored</td><td>crmvet_table1_table2_association</td></tr><tr><td><strong>Lookup to Associated Table</strong></td><td>Schema Name of the lookup to the associated/target table in the joint/association table (N:N)</td><td>crmvet_Table2Id</td></tr><tr><td><strong>Lookup to Current Table</strong></td><td>Schema Name of the lookup to the current table in the joint/association table (N:N)</td><td>crmvet_Table1Id</td></tr><tr><td><strong>Default Filter</strong></td><td>Default Filter for Selector Table to define what records would be visible in UI</td><td>statuscode eq 1</td></tr><tr><td><strong>Visibility Toggle</strong></td><td>Show or Hide in UI Selector Values. Useful if due to the number of options PCF takes too much space on a form</td><td>Yes/No</td></tr></tbody></table></figure>
<!-- /wp:table -->
