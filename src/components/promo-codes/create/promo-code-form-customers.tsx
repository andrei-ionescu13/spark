import type { FC, ChangeEvent } from "react";
import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  IconButton,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useDialog } from "@/hooks/useDialog";
import { AddUsersDialog } from "@/components/add-users-dialog";
import { Trash as TrashIcon } from "@/icons/trash";
import { Link } from "@/components/link";
import type { User } from "@/types/user";
import { useFormikContext } from "formik";
import type { PromoCodeFormValues } from "./promo-code-form";
import { Button } from "@/components/button";

export const PromoCodeFormCustomers: FC = () => {
  const formik = useFormikContext<PromoCodeFormValues>();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      {dialogOpen && (
        <AddUsersDialog
          open
          onClose={() => {
            handleCloseDialog();
          }}
          onAdd={(users: User[]) => {
            formik.setFieldValue("users", users);
          }}
          selectedUsers={formik.values.users}
        />
      )}
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="subtitle1">
              Customer eligibility
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              value={formik.values.userSelection}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                formik.setFieldTouched("users", false, false);
                formik.setFieldValue(
                  "userSelection",
                  (event.target as HTMLInputElement).value
                );
              }}
            >
              <FormControlLabel
                value="general"
                control={<Radio />}
                label="General"
              />
              <FormControlLabel
                value="selected"
                control={<Radio />}
                label="Selected customers"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={formik.values.userSelection !== "selected"}
              onClick={handleOpenDialog}
              color="primary"
              variant="contained"
            >
              Browse
            </Button>
          </Grid>
          {formik.touched.users && formik.errors.users && (
            <Grid item xs={12}>
              <FormHelperText error>
                {formik.errors.users as string}
              </FormHelperText>
            </Grid>
          )}
          {formik.values.userSelection === "selected" &&
            !!formik.values.users.length && (
              <Grid item xs={12}>
                <List disablePadding>
                  {formik.values.users.map((user) => (
                    <ListItem
                      key={user._id}
                      disableGutters
                      divider
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Link
                        color="textPrimary"
                        variant="body1"
                        underline="hover"
                        href={`/users/${user._id}`}
                      >
                        {user.email}
                      </Link>
                      <IconButton
                        color="error"
                        onClick={() => {
                          formik.setFieldValue(
                            "users",
                            formik.values.users.filter(
                              (_user) => _user._id !== user._id
                            )
                          );
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
        </Grid>
      </Card>
    </>
  );
};
