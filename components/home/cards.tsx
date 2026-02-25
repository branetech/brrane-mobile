import { View } from "@idimma/rn-widget"
import { TouchableOpacity, View as RNV, StyleSheet,  ImageBackground } from 'react-native';
import { ThemedText } from '@/components/themed-text'; // adjust import as needed



export const CardStyle = ({children}: any) => {
    
    return(
       <View w='100%' h={196} radius={16} bg={'#013D25'}>
         <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={{ flex: 1, width: "100%", height: 'auto', overflow: "hidden" }}
        resizeMode="cover"
      >
        <View p={22} flex={1}>
          {children}
        </View>
      </ImageBackground>
       </View>
    )
}

interface UnifiedCardProps {
    variant?: "full" | "compact";
    onPress?: () => void;
    icon: React.ReactNode;
    title: string;
    iconBg?: string;
    bg?: string;
    hide?: boolean;
    height?: number;
    border?: string;
    style?: object;
}

export const ServicesCard = ({
    variant = "full",
    onPress,
    icon,
    title,
    iconBg = "",
    bg = "",
    hide = false,
    height,
    border,
    style = {},
}: UnifiedCardProps) => {
    if (hide) return null;

    if (variant === "compact") {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.compactContainer, style]}
            >
                <RNV
                    style={[
                        styles.compactIconWrapper,
                        { backgroundColor: bg || "transparent", height: height ?? 56, borderColor: border, borderWidth: border ? 1 : 0 },
                    ]}
                >
                    {icon}
                </RNV>
                <ThemedText style={styles.title}>{title}</ThemedText>
            </TouchableOpacity>
        );
    }

    // Full variant (default)
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.fullContainer,
                { backgroundColor: bg || "transparent", height, borderColor: border, borderWidth: border ? 1 : 0 },
                style,
            ]}
        >
            <RNV
                style={[
                    styles.iconWrapper,
                    { backgroundColor: iconBg || "transparent" },
                ]}
            >
                {icon}
            </RNV>
            <ThemedText style={styles.title}>{title}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    compactContainer: {
        flex: 1,
        gap: 8,
        alignItems: "center",
        width: 80,
        justifyContent: "center",
        paddingVertical: 12,
        maxWidth: '100%',
        borderColor: '#E1FFF3',
        borderWidth: 1
    },
    compactIconWrapper: {
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        borderRadius: 8,
    },
    fullContainer: {
        flex: 1,
        gap: 8,
        alignItems: "center",
        width: 93.5,
        justifyContent: "center",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxWidth: '100%',
        borderColor: '#E1FFF3',
        borderWidth: 1

    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 10,
        textAlign: "center",
        lineHeight: 12,
    },
});