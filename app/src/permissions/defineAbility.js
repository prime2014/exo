import { defineAbility } from "@casl/ability";


export default (user) => defineAbility((can, cannot)=> {
  can('manage', 'all');
  cannot('delete', 'user');

  if(user.pk) {
    can("update", "Post", {pk : user.pk })
  }
})
