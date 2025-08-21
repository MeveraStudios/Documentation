---
sidebar_position: 6
---
# Command Help

:::warning
The Help API is **EXPERIMENTAL**, meaning that its not fully stable yet and may undergo breaking changes in the future.
:::

The new Help API makes it super easy to show help for your commands. It’s built from just a few simple building blocks:

### The 3 Main Parts

1. **HelpQuery** – What the user is asking for (like “show me help for this command”).
2. **HelpEntry** – Each piece of help info (like a command, subcommand, or usage).
3. **HelpRenderer** – How the help is shown (as a list, a tree, etc.).

When a user asks for help, here’s what happens:
- You make a `HelpQuery` (you can filter what the user is allowed to see).
- The system finds matching `HelpEntry` items.
- The entries are shown using a `HelpRenderer` (with your chosen layout and theme).

There are two layouts you can use out of the box:
- **List** – Shows commands in a simple list.
- **Tree** – Shows commands in a tree with branches.

All of this is managed by the `CommandHelp<YourSource>` object, which you get automatically in your command method.

---

### The Easiest Example

Here’s how you use the new Help API in your command:

```java
@Command("example")
public final class ExampleCommand {

    @Usage
    public void defaultUsage(YourSource source, @ContextResolved CommandHelp<YourSource> commandHelp) {
        // Show help when user runs '/example'
        commandHelp.display(
            HelpQuery.<YourSource>builder()
                .filter(HelpFilters.hasPermission(source, commandHelp)) // Only show what the user can use
                .build(),

            HelpRenderOptions.<YourSource>builder()
                .layout(HelpRenderOptions.Layout.LIST) // Show as a list
                .theme(HelpTheme.defaultTheme())       // Use the default look
        );
    }
}
```

**That’s it!**  
You don’t need to set up anything else for basic help.

---

### Customizing (Optional)

If you want to change how help looks or works, you can make your own layout, transformer, or renderer.  
For example, in Bukkit:

```java
BukkitImperat.builder(plugin)
    .helpCoordinator(
        HelpCoordinator.create((layoutManager) -> {
            layoutManager.registerPipeline(layout, transformer, renderer);
        })
    )
    .build();
```

But for most people, the default is enough!

---

## TL;DR

- **HelpQuery** = what help to show
- **HelpEntry** = each help item
- **HelpRenderer** = how it looks
- Use `CommandHelp.display()` in your command to show help
- Defaults are good, but you can customize if you want